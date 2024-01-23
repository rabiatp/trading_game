CREATE TABLE "t_user" (
	"id" serial NOT NULL,
	"name" character varying,
	"surname" character varying,
	CONSTRAINT "user_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "t_portfolio" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"share_id" integer NOT NULL,
	"quantity" DECIMAL(10) DEFAULT '2',
	"price" DECIMAL(10) DEFAULT '2',
    "date" DATE,
	"type" integer NOT NULL,
	CONSTRAINT "portfolio_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "t_share" (
	"id" serial NOT NULL,
	"name" character varying,
	"symbol" character varying,
	"share_rate" double precision DEFAULT 2,
	"date" DATE NOT NULL,
	CONSTRAINT "share_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "t_share_holding" (
	"id" serial NOT NULL,
	"share_id" integer NOT NULL,
	"total_shares_bought" DECIMAL,
	"total_shares_sold" DECIMAL,
	"available_shares" DECIMAL,
	CONSTRAINT "share_holding_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


CREATE TABLE "t_price_history" (
    "id" serial NOT NULL,
    "share_id" integer NOT NULL,
    "price" double precision DEFAULT 2,
    "date" DATE NOT NULL,
    CONSTRAINT "price_history_pk" PRIMARY KEY ("id")
) WITH (
    OIDS=FALSE
);



ALTER TABLE "t_portfolio" ADD CONSTRAINT "t_portfolio_fk0" FOREIGN KEY ("user_id") REFERENCES "t_user"("id");
ALTER TABLE "t_portfolio" ADD CONSTRAINT "t_portfolio_fk1" FOREIGN KEY ("share_id") REFERENCES "t_share"("id");


ALTER TABLE "t_share_holding" ADD CONSTRAINT "t_share_holding_fk0" FOREIGN KEY ("share_id") REFERENCES "t_share"("id");

ALTER TABLE "t_price_history" ADD CONSTRAINT "t_price_history_fk0" FOREIGN KEY ("share_id") REFERENCES "t_share"("id");



