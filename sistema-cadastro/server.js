const express = require("express")
const app = express()
app.use(express.json())
const port = 3000
const supabase = require("./supabase")

app.get("/", (req, res) => {
  res.send("Olá. O meu primeiro servidor com express funcionou.")
})

app.get("/usuarios", async (req, res) => {
  const { data, error } = await supabase.from("usuarios").select("*")

  if (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar usuários",
      erro: error.message,
    })
  }

  return res.json(data)
})

app.get("/usuarios/:id", async (req, res) => {
  const id = Number(req.params.id)

  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    return res.status(404).json({
      mensagem: "Usuário não encontrado",
      erro: error.message,
    })
  }

  return res.json(data)
})

app.post("/usuarios", async (req, res) => {
  const { nome, email, senha, perfil } = req.body

  const { data, error } = await supabase
    .from("usuarios")
    .insert([
      {
        nome: nome,
        email: email,
        senha: senha,
        perfil: perfil,
      },
    ])
    .select()

  if (!nome || nome.trim() === "") {
    return res.status(400).json({
      mensagem: "Nome é obrigatório",
    })
  }

  if (!email || email.trim() === "") {
    return res.status(400).json({
      mensagem: "Email é obrigatório",
    })
  }

  if (!senha || senha.trim() === "") {
    return res.status(400).json({
      mensagem: "Senha é obrigatória",
    })
  }

  if (!perfil || perfil.trim() === "") {
    return res.status(400).json({
      mensagem: "Perfil é obrigatório",
    })
  }

  if (error) {
    return res.status(500).json({
      mensagem: "Erro ao cadastrar usuário",
      erro: error.message,
    })
  }

  return res.status(201).json({
    mensagem: "Usuário criado com sucesso!",
    usuario: {
      id: data[0].id,
      nome: data[0].nome,
      email: data[0].email,
      perfil: data[0].perfil,
      status: data[0].status,
      data_cadastro: data[0].data_cadastro,
    },
  })
})

app.put("/usuarios/:id", async (req, res) => {
  const id = Number(req.params.id)

  const { nome, email } = req.body

  const { data, error } = await supabase
    .from("usuarios")
    .update({
      nome: nome,
      email: email,
    })
    .eq("id", id)
    .select()

  if (error) {
    return res.status(500).json({
      mensagem: "Erro ao atualizar usuário",
      erro: error.message,
    })
  }

  if (data.length === 0) {
    return res.status(404).json({
      mensagem: "Usuário não encontrado!",
    })
  }

  return res.json({
    mensagem: "Usuário atualizado com sucesso!",
    usuario: data[0],
  })
})

app.delete("/usuarios/:id", async (req, res) => {
  const id = Number(req.params.id)

  const { data, error } = await supabase
    .from("usuarios")
    .delete()
    .eq("id", id)
    .select()

  if (error) {
    return res.status(500).json({
      mensagem: "Erro ao excluir usuário",
      erro: error.message,
    })
  }

  if (data.length === 0) {
    return res.status(404).json({
      mensagem: "Usuário não encontrado!",
    })
  }

  return res.json({
    mensagem: "Usuário removido com sucesso!",
    usuario: data[0],
  })
})

app.listen(port, () => {
  console.log(`Servidor Express rodando em http://localhost:${port}`)
})
