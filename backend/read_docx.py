import sys
import os
import zipfile
import xml.etree.ElementTree as ET

def extract_text_from_docx(docx_path):
    try:
        document = zipfile.ZipFile(docx_path)
        xml_content = document.read('word/document.xml')
        document.close()
        tree = ET.XML(xml_content)
        
        paragraphs = []
        for paragraph in tree.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
            texts = [node.text for node in paragraph.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if node.text]
            if texts:
                paragraphs.append(''.join(texts))
        return '\n'.join(paragraphs)
    except Exception as e:
        return str(e)

if __name__ == "__main__":
    docs = ["backend/DOCUMENTACION/Historias de Usuario.docx", "backend/DOCUMENTACION/Descripcion.docx", "backend/DOCUMENTACION/integrador.docx"]
    for doc in docs:
        if os.path.exists(doc):
            text = extract_text_from_docx(doc)
            out_file = doc.replace(".docx", ".txt")
            with open(out_file, "w", encoding="utf-8") as f:
                f.write(text)
            print(f"Processed {doc}")
