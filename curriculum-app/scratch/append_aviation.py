import os

snippet = """

---
```absurd-abstract
image: https://res.cloudinary.com/l4eozknq/image/upload/v1790259237/o55xnd3m9xs9bcwp2673.jpg
question: What is going on in this image?
reveal: It is just a test image!
```
"""

with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\content\lessons\ug\bba-aviation\sem1\week1.md', 'a', encoding='utf-8') as f:
    f.write(snippet)
    
with open(r'C:\Projects\tcb-soft-skills\curriculum-app\src\content\lessons\ug\bsc-aviation\sem1\week1.md', 'a', encoding='utf-8') as f:
    f.write(snippet)
