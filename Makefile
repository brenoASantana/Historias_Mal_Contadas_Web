# Nome do projeto
PROJECT = historias_mal_contadas_web

# Comandos principais
install:
	npm install

dev:
	npm run dev

build:
	npm run build

preview:
	npm run preview

clean:
	rm -rf node_modules dist

# Atalhos
start: install dev
