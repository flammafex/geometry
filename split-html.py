#!/usr/bin/env python3
"""
Split index.html into modular sections for easier development
"""

import os
import re
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).parent
SRC_DIR = BASE_DIR / 'src'
PARTIALS_DIR = SRC_DIR / 'partials'
SECTIONS_DIR = SRC_DIR / 'sections'
INPUT_FILE = BASE_DIR / 'index.html'

def split_html():
    print("📂 Splitting index.html into modular sections...\n")

    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split into major parts
    # 1. Extract head (DOCTYPE to </head>)
    head_match = re.search(r'(<!DOCTYPE.*?</head>)', content, re.DOTALL)
    if head_match:
        head = head_match.group(1)
        (PARTIALS_DIR / 'head.html').write_text(head, encoding='utf-8')
        print("✓ Extracted head.html")

    # 2. Extract header (body start to main content)
    header_match = re.search(
        r'(<body>.*?)(<!-- Forward matter end -->)',
        content,
        re.DOTALL
    )
    if header_match:
        header = header_match.group(1) + header_match.group(2) + '\n<main>\n<article id="geometry">'
        (PARTIALS_DIR / 'header.html').write_text(header, encoding='utf-8')
        print("✓ Extracted header.html")

    # 3. Extract footer (</article></main> to </html>)
    footer_match = re.search(
        r'(</article>\s*</main>.*?</html>)',
        content,
        re.DOTALL
    )
    if footer_match:
        footer = footer_match.group(1)
        (PARTIALS_DIR / 'footer.html').write_text(footer, encoding='utf-8')
        print("✓ Extracted footer.html")

    # 4. Extract main content sections
    main_match = re.search(
        r'<article id="geometry">(.*?)</article>',
        content,
        re.DOTALL
    )

    if main_match:
        article_content = main_match.group(1)

        # Extract chapter header
        chapter_match = re.search(
            r'(\s*<h2 id="chapter-1".*?</h2>)',
            article_content,
            re.DOTALL
        )
        if chapter_match:
            chapter_header = chapter_match.group(1)
        else:
            chapter_header = ''

        # Extract Definitions section (section id="def")
        def_match = re.search(
            r'(<section id="def">.*?</section>)',
            article_content,
            re.DOTALL
        )
        if def_match:
            content_def = chapter_header + '\n' + def_match.group(1)
            (SECTIONS_DIR / 'book1' / '00-definitions.html').write_text(
                content_def,
                encoding='utf-8'
            )
            print("✓ Extracted book1/00-definitions.html")

        # Extract Postulates section (section id="post")
        post_match = re.search(
            r'(<section id="post">.*?</section>)',
            article_content,
            re.DOTALL
        )
        if post_match:
            (SECTIONS_DIR / 'book1' / '01-postulates.html').write_text(
                post_match.group(1),
                encoding='utf-8'
            )
            print("✓ Extracted book1/01-postulates.html")

        # Extract Common Notions section (section id="com") - but exclude I.1 prose
        notions_match = re.search(
            r'(<section id="com">.*?<h3 id="1\.1")',
            article_content,
            re.DOTALL
        )
        if notions_match:
            # Extract just the Common Notions, stopping before I.1
            notions_content = notions_match.group(1).rsplit('<h3 id="1.1"', 1)[0] + '</section>'
            (SECTIONS_DIR / 'book1' / '02-notions.html').write_text(
                notions_content,
                encoding='utf-8'
            )
            print("✓ Extracted book1/02-notions.html")

        # Extract Equilateral Triangle section (I.1)
        # This includes prose (from Common Notions section) + figure section
        i1_match = re.search(
            r'(<h3 id="1\.1".*?</section>)\s*(<!-->)\s*(<section>.*?</section>)',
            article_content,
            re.DOTALL
        )
        if i1_match:
            # Combine prose and figure, wrapping in a section
            i1_content = '<section>\n' + i1_match.group(1) + '\n' + i1_match.group(2) + '\n\t' + i1_match.group(3)
            (SECTIONS_DIR / 'book1' / '10-equilateral-triangle.html').write_text(
                i1_content,
                encoding='utf-8'
            )
            print("✓ Extracted book1/10-equilateral-triangle.html")

        # Extract Triangle Congruences section (I.4, I.8, I.26)
        congr_match = re.search(
            r'(<section>\s*<h3 id="1\.2">Triangle Congruences</h3>.*?)</section>\s*<section>\s*<h3 id="1\.3">',
            article_content,
            re.DOTALL
        )
        if congr_match:
            (SECTIONS_DIR / 'book1' / '20-triangle-congruences.html').write_text(
                congr_match.group(1) + '</section>',
                encoding='utf-8'
            )
            print("✓ Extracted book1/20-triangle-congruences.html")

        # Extract Isosceles Triangle section (I.5, I.6)
        iso_match = re.search(
            r'(<section>\s*<h3 id="1\.3">.*?)</section>\s*<section>\s*<h3 id="1\.4"',
            article_content,
            re.DOTALL
        )
        if iso_match:
            (SECTIONS_DIR / 'book1' / '30-isosceles-triangle.html').write_text(
                iso_match.group(1) + '</section>',
                encoding='utf-8'
            )
            print("✓ Extracted book1/30-isosceles-triangle.html")

        # Extract Bisection section (I.9, I.10)
        bisect_match = re.search(
            r'(<section>\s*<h3 id="1\.4".*?)</section>\s*<section>\s*<h3 id="1\.5"',
            article_content,
            re.DOTALL
        )
        if bisect_match:
            (SECTIONS_DIR / 'book1' / '40-bisection.html').write_text(
                bisect_match.group(1) + '</section>',
                encoding='utf-8'
            )
            print("✓ Extracted book1/40-bisection.html")

        # Extract Perpendiculars section (I.11, I.12)
        perp_match = re.search(
            r'(<section>\s*<h3 id="1\.5"[^<]*<.*?)</section>(?=\s*<section>\s*<h3 id="1\.6")',
            article_content,
            re.DOTALL
        )
        if perp_match:
            (SECTIONS_DIR / 'book1' / '50-perpendiculars.html').write_text(
                perp_match.group(1) + '</section>',
                encoding='utf-8'
            )
            print("✓ Extracted book1/50-perpendiculars.html")

        # Extract External Angle section (I.16)
        # This is the last section, so grab from <section><h3 id="1.6"> to the end
        ext_match = re.search(
            r'(<section>\s*<h3 id="1\.6".*$)',
            article_content,
            re.DOTALL
        )
        if ext_match:
            ext_content = ext_match.group(1).rstrip()
            # Make sure it ends with </section>
            if not ext_content.endswith('</section>'):
                # Find the last </section> in the content
                last_section_end = ext_content.rfind('</section>')
                if last_section_end != -1:
                    ext_content = ext_content[:last_section_end + len('</section>')]
            (SECTIONS_DIR / 'book1' / '60-external-angle.html').write_text(
                ext_content,
                encoding='utf-8'
            )
            print("✓ Extracted book1/60-external-angle.html")

    print("\n✅ Split complete!")
    print(f"📁 Partials: {len(list(PARTIALS_DIR.glob('*.html')))} files")
    print(f"📁 Sections: {len(list(SECTIONS_DIR.glob('**/*.html')))} files")

if __name__ == '__main__':
    split_html()
