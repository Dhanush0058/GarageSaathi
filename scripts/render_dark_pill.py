import fitz

# High-resolution dark pill banner (matching user's uploaded image backdrop)
svg_dark_pill = '''<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1000 320\" width=\"1000\" height=\"320\">
  <defs>
    <linearGradient id=\"goldCar\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"0%\">
      <stop offset=\"0%\" stop-color=\"#F59E0B\"/>
      <stop offset=\"30%\" stop-color=\"#FDE047\"/>
      <stop offset=\"60%\" stop-color=\"#F59E0B\"/>
      <stop offset=\"100%\" stop-color=\"#D97706\"/>
    </linearGradient>

    <radialGradient id=\"wheelRimGrad\" cx=\"50%\" cy=\"50%\" r=\"50%\">
      <stop offset=\"0%\" stop-color=\"#FFFFFF\"/>
      <stop offset=\"45%\" stop-color=\"#CBD5E1\"/>
      <stop offset=\"80%\" stop-color=\"#475569\"/>
      <stop offset=\"100%\" stop-color=\"#0F172A\"/>
    </radialGradient>

    <g id=\"wheelSpokes\">
      <line x1=\"0\" y1=\"-34\" x2=\"0\" y2=\"34\" stroke=\"#E2E8F0\" stroke-width=\"4\" stroke-linecap=\"round\"/>
      <line x1=\"-34\" y1=\"0\" x2=\"34\" y2=\"0\" stroke=\"#E2E8F0\" stroke-width=\"4\" stroke-linecap=\"round\"/>
      <line x1=\"-24\" y1=\"-24\" x2=\"24\" y2=\"24\" stroke=\"#E2E8F0\" stroke-width=\"3.5\" stroke-linecap=\"round\"/>
      <line x1=\"-24\" y1=\"24\" x2=\"24\" y2=\"-24\" stroke=\"#E2E8F0\" stroke-width=\"3.5\" stroke-linecap=\"round\"/>
      <line x1=\"-31\" y1=\"-12\" x2=\"31\" y2=\"12\" stroke=\"#CBD5E1\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>
      <line x1=\"-31\" y1=\"12\" x2=\"31\" y2=\"-12\" stroke=\"#CBD5E1\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>
      <line x1=\"-12\" y1=\"-31\" x2=\"12\" y2=\"31\" stroke=\"#CBD5E1\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>
      <line x1=\"-12\" y1=\"31\" x2=\"12\" y2=\"-31\" stroke=\"#CBD5E1\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>
      <circle cx=\"0\" cy=\"0\" r=\"13\" fill=\"#0F172A\" stroke=\"#F59E0B\" stroke-width=\"2\"/>
      <circle cx=\"0\" cy=\"0\" r=\"6\" fill=\"#E2E8F0\"/>
    </g>

    <g id=\"alloyWheel\">
      <circle cx=\"0\" cy=\"0\" r=\"50\" fill=\"#020617\" stroke=\"#475569\" stroke-width=\"3.5\"/>
      <circle cx=\"0\" cy=\"0\" r=\"47\" fill=\"none\" stroke=\"#1E293B\" stroke-width=\"2.5\" stroke-dasharray=\"4,3\"/>
      <circle cx=\"0\" cy=\"0\" r=\"41\" fill=\"none\" stroke=\"#F8FAFC\" stroke-width=\"3\"/>
      <circle cx=\"0\" cy=\"0\" r=\"37\" fill=\"url(#wheelRimGrad)\"/>
      <use href=\"#wheelSpokes\"/>
    </g>
  </defs>

  <!-- Dark Slate Rounded Pill Backdrop -->
  <rect x=\"10\" y=\"10\" width=\"980\" height=\"300\" rx=\"24\" fill=\"#0F172A\" stroke=\"#1E293B\" stroke-width=\"3\"/>
  <!-- Subtle gold top accent -->
  <line x1=\"80\" y1=\"10\" x2=\"920\" y2=\"10\" stroke=\"#F59E0B\" stroke-width=\"3\" opacity=\"0.6\"/>

  <g transform=\"translate(30, 0)\">
    <!-- 'Z9' Text on Left -->
    <g transform=\"translate(55, 115) skewX(-14)\">
      <path d=\"M 0,-62 L 56,-62 L 56,-48 L 19,-14 L 60,-14 L 60,0 L 0,0 L 0,-14 L 37,-48 L 0,-48 Z\" fill=\"url(#goldCar)\"/>
      <path d=\"M 82,-62 C 105,-62 120,-48 120,-30 C 120,-10 102,0 78,0 L 68,0 L 68,-14 L 80,-14 C 95,-14 104,-22 104,-30 C 104,-38 96,-48 82,-48 C 72,-48 66,-42 66,-34 L 52,-34 C 52,-48 65,-62 82,-62 Z M 76,-46 C 84,-46 90,-40 90,-32 C 90,-24 84,-18 76,-18 C 68,-18 64,-24 64,-32 C 64,-40 68,-46 76,-46 Z\" fill=\"url(#goldCar)\"/>
    </g>

    <!-- Sweeping Sports Car Silhouette -->
    <path d=\"M 200,105
             C 240,78 320,40 430,32
             C 510,26 620,38 720,72
             C 770,88 815,102 855,104
             C 820,95 765,80 710,65
             C 605,38 505,33 425,38
             C 325,45 245,82 200,105 Z\"
          fill=\"url(#goldCar)\"/>

    <path d=\"M 215,108
             C 275,88 345,62 430,55
             C 520,48 630,60 715,90
             C 630,70 525,60 435,65
             C 345,72 270,95 215,108 Z\"
          fill=\"url(#goldCar)\"/>

    <path d=\"M 270,120
             C 340,98 420,86 480,95
             C 540,104 600,122 660,118
             C 590,110 530,95 470,90
             C 410,85 330,98 270,120 Z\"
          fill=\"url(#goldCar)\"/>

    <path d=\"M 730,76
             C 775,85 825,92 870,88
             C 850,92 800,92 755,86 Z\"
          fill=\"url(#goldCar)\"/>

    <!-- 'AUTOMOTIVE' with Alloy Wheels -->
    <g transform=\"translate(0, 0)\">
      <path d=\"M 50,250 L 76,170 L 98,170 L 124,250 L 102,250 L 96,232 L 78,232 L 72,250 Z M 83,215 L 91,215 L 87,192 Z\" fill=\"#FFFFFF\"/>
      <path d=\"M 136,170 L 156,170 L 156,226 C 156,238 163,245 174,245 C 185,245 192,238 192,226 L 192,170 L 212,170 L 212,226 C 212,248 198,258 174,258 C 150,258 136,248 136,226 Z\" fill=\"#FFFFFF\"/>
      <path d=\"M 224,170 L 284,170 L 284,188 L 264,188 L 264,250 L 244,250 L 244,188 L 224,188 Z\" fill=\"#FFFFFF\"/>

      <!-- WHEEL 1 (replacing first 'O' in AUTO) -->
      <use href=\"#alloyWheel\" x=\"340\" y=\"214\"/>

      <path d=\"M 412,170 L 434,170 L 452,220 L 470,170 L 492,170 L 492,250 L 472,250 L 472,202 L 458,242 L 446,242 L 432,202 L 432,250 L 412,250 Z\" fill=\"#FFFFFF\"/>

      <!-- WHEEL 2 (replacing second 'O' in MOTIVE) -->
      <use href=\"#alloyWheel\" x=\"555\" y=\"214\"/>

      <path d=\"M 628,170 L 688,170 L 688,188 L 668,188 L 668,250 L 648,250 L 648,188 L 628,188 Z\" fill=\"#FFFFFF\"/>
      <path d=\"M 700,170 L 720,170 L 720,250 L 700,250 Z\" fill=\"#FFFFFF\"/>
      <path d=\"M 734,170 L 755,170 L 773,230 L 791,170 L 812,170 L 784,250 L 762,250 Z\" fill=\"#FFFFFF\"/>
      <path d=\"M 824,170 L 878,170 L 878,188 L 845,188 L 845,202 L 872,202 L 872,218 L 845,218 L 845,232 L 878,232 L 878,250 L 824,250 Z\" fill=\"#FFFFFF\"/>
    </g>
  </g>
</svg>'''

with open('assets/images/z9_dark_pill.svg', 'w', encoding='utf-8') as f:
    f.write(svg_dark_pill)

doc = fitz.open('assets/images/z9_dark_pill.svg')
page = doc[0]
pix = page.get_pixmap(dpi=120)
pix.save('assets/images/logo.png')
print(f'Saved assets/images/logo.png ({pix.width}x{pix.height})')
