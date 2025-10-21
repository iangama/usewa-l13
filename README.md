Projeto usewa - Nível 13
========================

Resumo
------
O projeto usewa marca a adoção de arquitetura de microserviços com Traefik SAFE, mantendo polish visual elevado e estrutura pronta para produção. 
Este nível 13 NÃO inclui autenticação JWT completa; as rotas de dados permanecem abertas ou com validação mínima. 
É a base direta para o nível 14 (TOT), que adiciona a autenticação JWT com refresh token.

Arquitetura
-----------
- Microserviços:
  - auth-service: endpoints básicos/placeholder de autenticação (sem JWT completo)
  - catalog-service: catálogo de produtos
  - orders-service: criação/listagem simples de pedidos
  - notifications-service: simulação de eventos/websocket
  - web: front-end (React + Vite)
- Infra: Traefik SAFE como reverse proxy, sem uso de portas 80/443
- Banco: PostgreSQL com healthcheck
- Cache/mensageria: Redis (opcional, para simulações)
- Todos os serviços na mesma rede Docker
- build.context correto em todos os serviços
- provider.docker habilitado e api.insecure desabilitado em produção

Traefik SAFE
------------
- Entrypoints:
  - web = :8880
  - websecure = :8443
- Roteamento por PathPrefix para cada serviço
- server.port declarado em cada container atrás do Traefik
- provider.docker = true
- Todo o tráfego passa pelos entrypoints definidos, sem expor 80/443

Banco e Infraestrutura
----------------------
- PostgreSQL (com healthcheck) e dependência explícita antes dos serviços
- Redis para simulações de cache e eventos
- Docker Compose único: infra/docker-compose.yml
- Healthchecks para facilitar a orquestração de subida

Front-end
---------
- Stack: React + Vite
- UI moderna e funcional (TailwindCSS), layout responsivo
- Dashboard com listagem de produtos e pedidos
- Rotas principais:
  - /app (dashboard)
  - /catalog (listagem)
  - /orders (histórico)
- Comunicação com os microserviços através do Traefik

Execução local
--------------
1) Criar o arquivo .env a partir do exemplo:
   cp .env.example .env

2) Build e subida das bases:
   docker compose -f infra/docker-compose.yml build
   docker compose -f infra/docker-compose.yml up -d traefik postgres redis

3) Subir os microserviços:
   docker compose -f infra/docker-compose.yml up -d auth-service catalog-service orders-service notifications-service web

4) Verificar healths:
   curl -s http://localhost:8880/auth/health && echo
   curl -s http://localhost:8880/catalog/health && echo
   curl -s http://localhost:8880/orders/health && echo
   curl -s http://localhost:8880/ws/health && echo

5) Acessar no navegador:
   http://localhost:8880/app

Smoke tests
-----------
- Todos os /health respondendo 200
- Dashboard carrega listagem do catálogo
- Pedidos podem ser criados/listados (sem autenticação JWT)
- Navegação entre seções funcionando via Traefik

Deploy
------
- Publicável em VPS ou PaaS (Render/Railway/etc.)
- Traefik SAFE com portas seguras 8880 e 8443
- Sem api.insecure em produção

Git e Publicação
----------------
Exemplo de publicação do projeto usewa:
cd ~/usewa
git init
git add .
git commit -m "Nível 13 - Projeto usewa com Traefik SAFE e microserviços"
git branch -M main
git remote add origin https://github.com/iangama/usewa.git
git push -u origin main
Quando solicitado:
Username: iangama
Password: (cole seu Personal Access Token Classic)

Classificação
-------------
Nível 13 - Projeto intermediário-avançado.
Arquitetura de produção com Traefik SAFE, microserviços e front-end polido.
Serviu como base para o nível 14 (TOT) que adiciona autenticação JWT completa com refresh token.
