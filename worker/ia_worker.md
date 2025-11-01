# IA Worker (stub)

Este worker deve rodar em Railway/Render e processar: 
- reconhecimento de raça (Roboflow/Pytorch)
- geração de descrição (OpenAI)
- moderação de imagens (AWS Rekognition ou OpenAI)

Fluxo sugerido:
1. Upload de imagem -> /api/upload -> retorna URL
2. Worker (queue) pega URL -> processa -> salva resultados em `media` e `posts`

Implementação: escolha entre Node.js (bullmq) ou Python (RQ).
