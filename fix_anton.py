import os
import re

directory = 'src/modules/admin'

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()

            new_content = content
            
            def font_anton_repl(match):
                cls = match.group(1)
                # Remove tracking
                cls = re.sub(r'\btracking-tight\b', '', cls)
                cls = re.sub(r'\btracking-wide\b', '', cls)
                
                # Replace text size with text-xl
                cls = re.sub(r'\btext-\[[^\]]+\]', 'text-xl', cls)
                cls = re.sub(r'\btext-(xs|sm|base|lg|2xl|3xl|4xl)\b', 'text-xl', cls)
                
                # Ensure lowercase
                if 'lowercase' not in cls:
                    cls += ' lowercase'
                
                # Ensure text-text
                if 'text-text' not in cls and 'text-white' not in cls:
                    cls += ' text-text'
                
                # Ensure text-xl is present if it wasn't there
                if 'text-xl' not in cls:
                    cls += ' text-xl'
                
                # Cleanup spaces
                cls = ' '.join(cls.split())
                
                return f'class="{cls}"'
            
            def class_repl(match):
                cls = match.group(1)
                if 'font-anton' in cls:
                    return font_anton_repl(match)
                return match.group(0)

            new_content = re.sub(r'class="([^"]+)"', class_repl, new_content)

            if content != new_content:
                with open(filepath, 'w') as f:
                    f.write(new_content)
                print(f"Updated {filepath}")
