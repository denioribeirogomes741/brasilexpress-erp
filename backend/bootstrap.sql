create table categoria(
    cod_categoria number primary key,
    nome_categoria varchar2(30),
    prefixo varchar2(5)
);

create table metodo_pagamento(
    cod_metodo number primary key,
    nome_metodo varchar2(20)
);

create table tipo_servico(
    cod_tipo number primary key,
    descricao varchar2(30),
    valor number
);

create table cliente(
    cod_cliente number primary key,
    nome_cliente varchar2(50),
    endereco varchar(80),
    telefone varchar(20),
    ficha char(4),
    email varchar(50)
);

create table item(
    cod_item number primary key,
    nome_item varchar2(30),
    descricao varchar2(100),
    qnt number(3),
    cod_categoria number references categoria(cod_categoria),
    pr_custo number,
    pr_venda number
);

create table venda(
    cod_venda number primary key,
    valor_total number,
    obs varchar2(100),
    cod_metodo number references metodo_pagamento (cod_metodo),
    cod_cliente number references cliente (cod_cliente)
);

create table itens_venda(
    cod_item number references item (cod_item),
    cod_venda number references venda (cod_venda)
);

create table servico(
    cod_servico number primary key,
    dt_entrada date default sysdate,
    acessorios varchar2(80),
    equipamento varchar2(30),
    valor number,
    desc_servico varchar2(100),
    obs varchar2(100),
    dt_previsao date,
    status varchar2(20),
    cod_cliente number references cliente(cod_cliente)
);

create table itens_servico(
    cod_servico number references servico(cod_servico),
    cod_item number references item(cod_item)
);

create sequence sq_pk_categoria;
create sequence sq_pk_metodo_pagamento;
create sequence sq_pk_tipo_servico;
create sequence sq_pk_cliente;
create sequence sq_pk_item;
create sequence sq_pk_venda;
create sequence sq_pk_servico;

create or replace trigger tg_pk_categoria
before insert
on categoria
referencing new as new
for each row
begin
    :new.cod_categoria := sq_pk_categoria.nextval;
end;
/

create or replace trigger tg_pk_metodo_pagamento
before insert
on metodo_pagamento
referencing new as new
for each row
begin
    :new.cod_metodo := sq_pk_metodo_pagamento.nextval;
end;
/

create or replace trigger tg_pk_tipo_servico
before insert
on tipo_servico
referencing new as new
for each row
begin
    :new.cod_tipo := sq_pk_tipo_servico.nextval;
end;
/

create or replace trigger tg_pk_cliente
before insert
on cliente
referencing new as new
for each row
begin
    :new.cod_cliente := sq_pk_cliente.nextval;
end;
/

create or replace trigger tg_pk_item
before insert
on item
referencing new as new
for each row
begin
    :new.cod_item := sq_pk_item.nextval;
end;
/

create or replace trigger tg_pk_venda
before insert
on venda
referencing new as new
for each row
begin
    :new.cod_venda := sq_pk_venda.nextval;
end;
/

create or replace trigger tg_pk_servico
before insert
on servico
referencing new as new
for each row
begin
    :new.cod_servico := sq_pk_servico.nextval;
end;
/