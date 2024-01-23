create or replace view v_user_portfolio as 
SELECT users.id,
    users.name,
    users.surname,
    portfolio.quantity,
    portfolio.price,
    portfolio.date AS registration_date,
        CASE
            WHEN portfolio.type = 1 THEN 'BUY'::text
            WHEN portfolio.type = 2 THEN 'SELL'::text
            ELSE NULL::text
        END AS sales_type,
    shares.name AS shares_name,
    shares.symbol AS shares_symbol
   FROM t_user users
     JOIN t_portfolio portfolio ON portfolio.user_id = users.id
     LEFT JOIN t_share shares ON shares.id = portfolio.share_id;


create or replace view v_share as 
 SELECT DISTINCT ON (shares.symbol) shares.id,
    shares.name,
    shares.symbol,
    shares.share_rate,
    shares.date AS insert_date,
    holding.id AS share_holding_id,
    holding.total_shares_bought,
    holding.total_shares_sold,
    holding.available_shares,
    pricehis.price,
    pricehis.date AS updateddate
   FROM t_share shares
     JOIN t_price_history pricehis ON pricehis.share_id = shares.id
     LEFT JOIN t_share_holding holding ON holding.share_id = shares.id
  ORDER BY shares.symbol, pricehis.date DESC;
