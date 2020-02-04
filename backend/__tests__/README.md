# Observação

<p>SQLite dando problemas em relação à configuração da aplicação. Para ser mais específico, com o tipo de data sendo utilizada no Postgre</p>
Se utilizado o tipo

```sql
timestampz
```

Há conflito de parser com o SQLite
.

Testes descontinuados.
Será verificado uma forma de lidar com as datas de forma à atender as boas práticas e que não haja conflito com ambas as bases.
