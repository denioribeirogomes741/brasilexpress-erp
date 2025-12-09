import oracledb from 'oracledb';
import { Request, Response } from 'express';
import { getPool } from './db';

// Utility: execute SQL and return result (rows/outBinds)
async function runQuery(sql: string, binds: any = {}, opts: any = {}) {
  const pool = await getPool();
  const conn = await pool.getConnection();
  try {
    const result = await conn.execute(sql, binds, { outFormat: (oracledb as any).OUT_FORMAT_OBJECT, autoCommit: true, ...opts });
    return result as oracledb.Result<any>;
  } finally {
    await conn.close();
  }
}

// --- Categoria CRUD ---
export async function listCategorias(req: Request, res: Response) {
  try {
    const r = await runQuery('SELECT * FROM categoria ORDER BY cod_categoria');
    res.json((r.rows as any[]) || []);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
}

export async function getCategoria(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    const r = await runQuery('SELECT * FROM categoria WHERE cod_categoria = :id', { id });
    res.json(((r.rows as any[]) || [])[0] || null);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
}

export async function createCategoria(req: Request, res: Response) {
  const { nome_categoria, prefixo } = req.body;
  try {
    await runQuery('INSERT INTO categoria (nome_categoria, prefixo) VALUES (:nome_categoria, :prefixo)', { nome_categoria, prefixo });
    res.status(201).json({ ok: true });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
}

export async function updateCategoria(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { nome_categoria, prefixo } = req.body;
  try {
    await runQuery('UPDATE categoria SET nome_categoria=:nome_categoria, prefixo=:prefixo WHERE cod_categoria=:id', { nome_categoria, prefixo, id });
    res.json({ ok: true });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
}

export async function deleteCategoria(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    await runQuery('DELETE FROM categoria WHERE cod_categoria = :id', { id });
    res.json({ ok: true });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
}

// --- Metodo Pagamento CRUD ---
export async function listMetodos(req: Request, res: Response) {
  try {
    const r = await runQuery('SELECT * FROM metodo_pagamento ORDER BY cod_metodo');
    res.json((r.rows as any[]) || []);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
}

export async function createMetodo(req: Request, res: Response) {
  const { nome_metodo } = req.body;
  try {
    await runQuery('INSERT INTO metodo_pagamento (nome_metodo) VALUES (:nome_metodo)', { nome_metodo });
    res.status(201).json({ ok: true });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
}

// --- Servico CRUD ---
export async function listServicos(req: Request, res: Response) {
  try {
    const r = await runQuery("SELECT COD_SERVICO, to_char(DT_ENTRADA, 'DD/MM/YYYY') AS DATA_ENTRADA, ACESSORIOS, EQUIPAMENTO, VALOR, DESC_SERVICO, OBS, to_char(DT_PREVISAO, 'DD/MM/YYYY') AS DATA_PREVISAO, STATUS, NOME_CLIENTE FROM servico s JOIN cliente c ON s.cod_cliente = c.cod_cliente ORDER BY cod_servico");
    
    const servicos = (r.rows as any[]).map(s => ({
      id: s.COD_SERVICO,
      descricao: s.DESC_SERVICO,
      cliente: s.NOME_CLIENTE,
      equipamento: s.EQUIPAMENTO,
      acessorios: s.ACESSORIOS,
      valor: s.VALOR,
      dataEntrada: s.DATA_ENTRADA,
      previsaoEntrega: s.DATA_PREVISAO,
      obs: s.OBS,
      status: s.STATUS
    }));
    res.json(servicos);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
}


// --- Tipo Servico CRUD ---
export async function listTipos(req: Request, res: Response) {
  try {
    const r = await runQuery('SELECT * FROM tipo_servico ORDER BY cod_tipo');
    res.json((r.rows as any[]) || []);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
}

export async function createTipo(req: Request, res: Response) {
  const { descricao, valor } = req.body;
  try {
    await runQuery('INSERT INTO tipo_servico (descricao, valor) VALUES (:descricao, :valor)', { descricao, valor });
    res.status(201).json({ ok: true });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
}

// --- Cliente CRUD ---
export async function listClientes(req: Request, res: Response) {
  try {
    const r = await runQuery('SELECT c.cod_cliente, c.nome_cliente, c.endereco, c.telefone, c.ficha, c.email, (SELECT COUNT(*) FROM servico s WHERE s.cod_cliente = c.cod_cliente) AS totalServicos FROM cliente c ORDER BY c.cod_cliente');
    
    const clientes = (r.rows as any[]).map(c => ({
      id: c.COD_CLIENTE,
      nome: c.NOME_CLIENTE,
      email: c.EMAIL,
      telefone: c.TELEFONE,
      endereco: c.ENDERECO,
      ficha: c.FICHA,
      totalServicos: c.TOTALSERVICOS || 0
    }));
    res.json(clientes);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
}

export async function createCliente(req: Request, res: Response) {
  const { nome_cliente, endereco, telefone, ficha, email } = req.body;
  try {
    await runQuery('INSERT INTO cliente (nome_cliente, endereco, telefone, ficha, email) VALUES (:nome_cliente, :endereco, :telefone, :ficha, :email)', { nome_cliente, endereco, telefone, ficha, email });
    res.status(201).json({ ok: true });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
}

// --- Item CRUD ---
export async function listItems(req: Request, res: Response) {
  try {
    const r = await runQuery('SELECT COD_ITEM, IDENTIFICADOR, NOME_ITEM, DESCRICAO, MIN_QNT, QNT, NOME_CATEGORIA, CONDICAO, PR_CUSTO, PR_VENDA FROM item i JOIN categoria c ON i.cod_categoria = c.cod_categoria ORDER BY cod_item');
    
    const itens = (r.rows as any[]).map(i => ({
      id: i.COD_ITEM,
      codigo: i.IDENTIFICADOR,
      nome: i.NOME_ITEM,
      descricao: i.DESCRICAO,
      estoque_minimo: i.MIN_QNT,
      quantidade: i.QNT,
      categoria: i.NOME_CATEGORIA,
      condicao: i.CONDICAO,
      preco_custo: i.PR_CUSTO,
      preco_venda: i.PR_VENDA
    }));
    
    res.json(itens);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
}

export async function createItem(req: Request, res: Response) {
  const { nome_item, descricao, qnt, cod_categoria, pr_custo, pr_venda } = req.body;
  try {
    await runQuery('INSERT INTO item (nome_item, descricao, qnt, cod_categoria, pr_custo, pr_venda) VALUES (:nome_item, :descricao, :qnt, :cod_categoria, :pr_custo, :pr_venda)', { nome_item, descricao, qnt, cod_categoria, pr_custo, pr_venda });
    res.status(201).json({ ok: true });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
}

// --- Venda + itens_venda ---
export async function createVenda(req: Request, res: Response) {
  const { valor_total = 0, obs = null, cod_metodo = null, cod_cliente = null, itens = [] } = req.body;
  const pool = await getPool();
  const conn = await pool.getConnection();
  try {
    // Insert venda using RETURNING to capture cod_venda (trigger sets it BEFORE INSERT)
    const result = await conn.execute(
      `INSERT INTO venda (valor_total, obs, cod_metodo, cod_cliente)
       VALUES (:valor_total, :obs, :cod_metodo, :cod_cliente)
       RETURNING cod_venda INTO :cod_venda`,
      { valor_total, obs, cod_metodo, cod_cliente, cod_venda: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER } },
      { autoCommit: false }
    );

    const cod_venda = (result.outBinds as any).COD_VENDA || (result.outBinds as any).cod_venda;

    // Insert itens
    for (const cod_item of itens) {
      await conn.execute(`INSERT INTO itens_venda (cod_item, cod_venda) VALUES (:cod_item, :cod_venda)`, { cod_item, cod_venda });
    }

    await conn.commit();
    res.status(201).json({ ok: true, cod_venda });
  } catch (error) {
    await conn.rollback();
    const err = error as Error;
    res.status(500).json({ error: err.message });
  } finally {
    await conn.close();
  }
}

export async function getVenda(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    const r = await runQuery(`SELECT v.*, m.nome_metodo, c.nome_cliente
    FROM venda v
    LEFT JOIN metodo_pagamento m ON v.cod_metodo = m.cod_metodo
    LEFT JOIN cliente c ON v.cod_cliente = c.cod_cliente
    WHERE v.cod_venda = :id`, { id });

    const items = await runQuery('SELECT i.* FROM item i JOIN itens_venda iv ON i.cod_item = iv.cod_item WHERE iv.cod_venda = :id', { id });
    res.json({ venda: ((r.rows as any[]) || [])[0] || null, itens: (items.rows as any[]) || [] });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
}

// --- Servico + itens_servico ---
export async function createServico(req: Request, res: Response) {
  const { acessorios = null, equipamento = null, valor = null, desc_servico = null, obs = null, dt_previsao = null, status = null, cod_cliente = null, itens = [] } = req.body;
  const pool = await getPool();
  const conn = await pool.getConnection();
  try {
    const result = await conn.execute(
      `INSERT INTO servico (acessorios, equipamento, valor, desc_servico, obs, dt_previsao, status, cod_cliente)
       VALUES (:acessorios, :equipamento, :valor, :desc_servico, :obs, :dt_previsao, :status, :cod_cliente)
       RETURNING cod_servico INTO :cod_servico`,
      { acessorios, equipamento, valor, desc_servico, obs, dt_previsao, status, cod_cliente, cod_servico: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER } },
      { autoCommit: false }
    );

    const cod_servico = (result.outBinds as any).COD_SERVICO || (result.outBinds as any).cod_servico;

    for (const cod_item of itens) {
      await conn.execute(`INSERT INTO itens_servico (cod_servico, cod_item) VALUES (:cod_servico, :cod_item)`, { cod_servico, cod_item });
    }

    await conn.commit();
    res.status(201).json({ ok: true, cod_servico });
  } catch (error) {
    await conn.rollback();
    const err = error as Error;
    res.status(500).json({ error: err.message });
  } finally {
    await conn.close();
  }
}

export async function getServico(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    const r = await runQuery('SELECT * FROM servico WHERE cod_servico = :id', { id });
    const items = await runQuery('SELECT i.* FROM item i JOIN itens_servico isv ON i.cod_item = isv.cod_item WHERE isv.cod_servico = :id', { id });
    res.json({ servico: ((r.rows as any[]) || [])[0] || null, itens: (items.rows as any[]) || [] });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
}