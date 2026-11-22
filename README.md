# Portfólio — João Castro

Portfólio pessoal em **HTML, CSS e JavaScript**, criado para Programação Web Frontend (UNIT, prof. Josimar Santos). Este pacote foi atualizado a partir do ZIP editado pelo autor; os miniprojetos mantêm suas versões, com pequenos ajustes de responsividade e usabilidade.

## Executar

1. Extraia todo o ZIP, mantendo a estrutura de pastas.
2. Abra **`index.html`** no navegador.
3. Os botões **Testar** abrem as demonstrações locais, e **GitHub** abre o repositório específico.
4. O site principal funciona offline; o envio de contato e recursos hospedados por terceiros exigem internet.

## Contato — ativação necessária

O formulário está configurado para receber mensagens em **joaobrtcastro@gmail.com**, usando [FormSubmit](https://formsubmit.co/) e validação em JavaScript.

1. Após publicar o portfólio (ou abrir localmente), preencha e envie uma mensagem de teste pelo formulário.
2. Abra a caixa de entrada de **joaobrtcastro@gmail.com**, procure o e-mail de ativação enviado pelo **FormSubmit** (confira também Spam) e confirme o endereço.
3. Faça **outro teste** após ativar e confirme que a mensagem chegou.

**Atenção:** o endereço de destino já foi configurado, mas o recebimento não foi ativado nem testado com uma mensagem real neste pacote. É necessária a confirmação pelo proprietário do Gmail. O FormSubmit é um serviço externo; mensagens passam pela infraestrutura dele. O formulário usa reCAPTCHA e campo antispam oculto. O envio abre a página de confirmação do FormSubmit. Não coloque senhas nem chaves privadas no HTML ou JavaScript.

## Repositórios dos miniprojetos

- [Calculadora](https://github.com/Domkaio/miniprojeto-calculadora) — operações básicas e teclado
- [Lâmpada](https://github.com/Domkaio/miniprojeto-lampada) — alternância de imagem e cenário
- [Lista de tarefas](https://github.com/Domkaio/miniprojeto-lista-de-tarefas) — criação e remoção de tarefas

As demonstrações locais estão em `projetos/`. Os links para o GitHub foram fornecidos pelo autor e levam ao **código-fonte**; não dependem de GitHub Pages estar ativado para cada repositório.

## Principais arquivos

```text
Portfolio-Joao-Castro/
├── index.html
├── style.css
├── script.js
├── assets/
│   ├── favicon.svg
│   └── ilustracao-perfil.svg
└── projetos/
    ├── calculadora/
    ├── lampada/
    └── lista-de-tarefas/
```

## Substituir a imagem do Sobre Mim

1. Salve sua foto otimizada como `assets/minha-foto.webp`.
2. No `index.html`, altere a origem de `assets/ilustracao-perfil.svg` para `assets/minha-foto.webp`.
3. Atualize o texto alternativo (`alt`) para descrever sua imagem.

## Publicação

No GitHub, crie um repositório para o portfólio e envie **o conteúdo da pasta principal** para a raiz do repositório. Em **Settings → Pages**, configure a publicação a partir da branch `main` e pasta `/ (root)`. Após publicar, teste a responsividade, os links dos projetos e o formulário.

## Entrega na UNIT

O PDF da atividade solicita o **ZIP no AVA**. A publicação no GitHub complementa a entrega, mas não a substitui. A seção de habilidades usa indicadores **qualitativos**, sem porcentagens. O miniprojeto de lâmpada foi um exercício em grupo (Wendell, João Gabriel Brito e Manuela).

---

João Castro · https://github.com/Domkaio
