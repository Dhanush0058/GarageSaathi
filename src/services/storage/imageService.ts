// Image Capture & Upload Service
// Handles Camera capture, Gallery selection, base64 / local caching,
// and Supabase Storage upload with persistent offline retry queue.

import * as ImagePicker from 'expo-image-picker';
import { InspectionPhoto } from '../../types';
import { LocalDB } from './localDatabase';
import { supabase, isSupabaseConfigured } from '../supabase/client';

export const ImageService = {
  // Request permissions
  async requestCameraPermissions(): Promise<boolean> {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === 'granted';
  },

  async requestMediaLibraryPermissions(): Promise<boolean> {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  },

  // Launch Camera
  async takePhoto(): Promise<string | null> {
    const hasPermission = await this.requestCameraPermissions();
    if (!hasPermission) {
      alert('Camera permission is required to capture inspection photos.');
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7, // Optimized compression for evidence readability
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      return result.assets[0].uri;
    }
    return null;
  },

  // Pick from Gallery
  async pickImage(): Promise<string | null> {
    const hasPermission = await this.requestMediaLibraryPermissions();
    if (!hasPermission) {
      alert('Photo gallery permission is required to select photos.');
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      return result.assets[0].uri;
    }
    return null;
  },

  // Create photo record and process upload
  async attachPhoto(params: {
    inspectionId: string;
    localUri: string;
    photoType: InspectionPhoto['photoType'];
    resultId?: string;
    categoryCode?: string;
    caption?: string;
  }): Promise<InspectionPhoto> {
    const photoId = `photo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const fileName = `${params.inspectionId}/${photoId}.jpg`;

    const photoRecord: InspectionPhoto = {
      id: photoId,
      inspectionId: params.inspectionId,
      resultId: params.resultId,
      categoryCode: params.categoryCode,
      localUri: params.localUri,
      fileName,
      storagePath: fileName,
      mimeType: 'image/jpeg',
      caption: params.caption,
      photoType: params.photoType,
      syncStatus: 'pending_upload',
      createdAt: new Date().toISOString(),
    };

    // Save locally to inspection
    await LocalDB.addInspectionPhoto(params.inspectionId, photoRecord);

    // Enqueue for background upload
    await LocalDB.enqueueUpload(photoRecord);

    // Attempt upload immediately if online
    this.processUploadQueue().catch(console.error);

    return photoRecord;
  },

  // Upload processor with retry logic
  async processUploadQueue(): Promise<void> {
    const queue = await LocalDB.getUploadQueue();
    if (queue.length === 0) return;

    if (!isSupabaseConfigured) {
      // Offline / Local mock mode: mark local queue as synced locally
      for (const item of queue) {
        await LocalDB.dequeueUpload(item.id);
      }
      return;
    }

    for (const item of queue) {
      try {
        if (!item.localUri) {
          await LocalDB.dequeueUpload(item.id);
          continue;
        }

        // Fetch local file as blob
        const response = await fetch(item.localUri);
        const blob = await response.blob();

        const { error } = await supabase.storage
          .from('inspection-photos')
          .upload(item.fileName, blob, {
            contentType: item.mimeType,
            upsert: true,
          });

        if (!error) {
          // Successfully uploaded to Supabase Storage
          await LocalDB.dequeueUpload(item.id);
        } else {
          console.warn('Upload error for item:', item.id, error.message);
        }
      } catch (err) {
        console.warn('Failed to upload photo in queue:', err);
      }
    }
  },
};
