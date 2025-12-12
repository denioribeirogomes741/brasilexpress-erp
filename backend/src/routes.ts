import express from 'express';
import * as ctrl from './controllers';

const router = express.Router();

// Categoria
router.get('/categorias', ctrl.listCategorias);
router.get('/categorias/:id', ctrl.getCategoria);
router.post('/categorias', ctrl.createCategoria);
router.put('/categorias/:id', ctrl.updateCategoria);
router.delete('/categorias/:id', ctrl.deleteCategoria);

// Metodo pagamento
router.get('/metodos', ctrl.listMetodos);
router.post('/metodos', ctrl.createMetodo);

// Tipo servico
router.get('/tipos-servico', ctrl.listTipos);
router.post('/tipos-servico', ctrl.createTipo);

// Cliente
router.get('/clientes', ctrl.listClientes);
router.post('/clientes', ctrl.createCliente);

// Item
router.get('/items', ctrl.listItems);
router.post('/items', ctrl.createItem);
router.put('/items/:id', ctrl.updateItem);
router.delete('/items/:id', ctrl.deleteItem);

// SubItens
router.get('/sub-itens', ctrl.listSubItens);
router.post('/sub-itens', ctrl.createSubItem);
router.put('/sub-itens/:id', ctrl.updateSubItem);
router.delete('/sub-itens/:id', ctrl.deleteSubItem);

// Venda
router.post('/vendas', ctrl.createVenda);
router.get('/vendas/:id', ctrl.getVenda);

// Servico
router.post('/servicos', ctrl.createServico);
router.get('/servicos', ctrl.listServicos);

export default router;