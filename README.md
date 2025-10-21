Projeto AtlasPulse - Nível 13
=============================

Resumo
------
O projeto AtlasPulse marca a transição para uma arquitetura de microserviços com Traefik SAFE, mantendo polish visual elevado e estrutura completa de produção. 
Foi o primeiro projeto da linha com Traefik configurado corretamente sem uso de portas 80/443, com entrypoints seguros e provider.docker habilitado. 
Toda a aplicação é composta por múltiplos serviços independentes, integrados via reverse proxy, com front-end funcional e moderno.

Arquitetura
------------
- Microserviços:
  - auth-service: controle básico de autenticação (mock/simulado)
  - catalog-service: catálogo de produtos
  - orders-service: pedidos
  - notifications-service: eventos e websocket
  - web: dashboard front-end
- Banco: PostgreSQL com healthcheck
- Proxy reverso: Traefik SAFE
- Todos os containers na mesma rede Docker
- build.context correto em todos os serviços
- Sem uso de api.insecure

Traefik SAFE
------------
- Entrypoints definidos:
  - web = :8880
  - websecure = :8443
- provider.docker = true
- Rotas definidas por PathPrefix por serviço
- Cada container declara explicitamente seu server.port
- Todos os serviços acessíveis via http://localhost:8880/<serviço>/
- Estrutura de rede compartilhada "appnet" entre todos os containers

Banco e Infraestrutura
----------------------
- PostgreSQL configurado com healthcheck e dependência explícita
- Persistência de dados simulada para catálogo e pedidos
- Redis opcional para cache e simulação de mensagens
- Docker Compose unificado em infra/docker-compose.yml

Front-end
----------
- Aplicação web construída com React + Vite
- TailwindCSS e componentes reutilizáveis
- UI moderna, escura e funcional
- Dashboard com resumo de pedidos, produtos e usuários
- Layout polido e responsivo
- Rotas principais:
  - /app → dashboard
  - /catalog → listagem de produtos
  - /orders → pedidos recentes
- Comunicação real entre front e back-end via Traefik
- Testado com smoke test end-to-end

Execução local
---------------
1. Criar .env a partir do exemplo:
   cp .env.example .env
2. Build completo:
   docker compose -f infra/docker-compose.yml build
3. Subir os serviços base:
   docker compose -f infra/docker-compose.yml up -d traefik postgres redis
4. Subir os microserviços:
   docker compose -f infra/docker-compose.yml up -d auth-service catalog-service orders-service notifications-service web
5. Verificar healths:
   curl -s http://localhost:8880/auth/health && echo
   curl -s http://localhost:8880/catalog/health && echo
   curl -s http://localhost:8880/orders/health && echo
   curl -s http://localhost:8880/ws/health && echo
6. Abrir no navegador:
   http://localhost:8880/app

Smoke tests
------------
Testes rápidos de funcionamento:
- Serviços respondendo 200 em /health
- Catálogo retornando lista de produtos
- Dashboard carregando dados via Traefik
- Layout e navegação entre seções funcionando

Deploy
------
A aplicação pode ser publicada em VPS ou plataforma pública (Render, Railway, etc).
O Traefik SAFE garante isolamento das portas padrão, utilizando apenas 8880 e 8443.

GitHub
------
Para subir o projeto:
cd ~/atlaspulse
git init
git add .
git commit -m "Nível 13 - Projeto AtlasPulse com Traefik SAFE e Microserviços"
git branch -M main
git remote add origin https://github.com/iangama/atlaspulse.git
git push -u origin main
Ao pedir credenciais:
Username: iangama
Password: (cole seu Personal Access Token Classic)

Classificação
--------------
Nível 13 - Projeto intermediário-avançado.
Primeiro projeto com arquitetura de produção segura, Traefik SAFE, rede unificada e front-end polido.
Serviu de base direta para o nível 14 (TOT), que adicionou autenticação JWT completa.
