import re

with open('reference/branding/site.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Check font families
font_families = set(re.findall(r'font-family:\s*([^;}]+)', css))
print('Font families:', font_families)

# Check color variables
colors = set(re.findall(r'#[0-9a-fA-F]{3,8}\b', css))
print('CSS Colors found count:', len(colors))
# sample colors
for c in sorted(colors)[:30]:
    print(' ', c)
