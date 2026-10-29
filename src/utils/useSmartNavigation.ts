import { useEffect, useRef } from 'react';
import { BackHandler, PanResponder } from 'react-native';

export function useSmartNavigation(onBack?: () => void, isEnabled: boolean = true) {
  useEffect(() => {
    if (!isEnabled || !onBack) return;

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack();
      return true;
    });

    return () => subscription.remove();
  }, [onBack, isEnabled]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        if (!isEnabled || !onBack) return false;
        // Edge swipe from left: start near left edge (x0 < 60) and moving right
        return gestureState.x0 < 60 && gestureState.dx > 25 && Math.abs(gestureState.dy) < 30;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 60 || gestureState.vx > 0.4) {
          onBack?.();
        }
      },
    })
  ).current;

  return panResponder.panHandlers;
}
