DROP TABLE IF EXISTS "ingredients";

DROP TABLE IF EXISTS "hardware";

DROP TABLE IF EXISTS "instructions";

DROP TABLE IF EXISTS "recipes";

DROP TABLE IF EXISTS "recipe_ingredients";

DROP TABLE IF EXISTS "recipe_hardware";

CREATE TABLE IF NOT EXISTS "ingredients" (
  "id" serial primary key,
  "name" varchar(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS "hardware" (
  "id" serial primary key,
  "name" varchar(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS "recipes" (
  "id" serial primary key,
  "name" varchar(50) NOT NULL,
  "prep_time" int NOT NULL,
  "cook_time" int NOT NULL,
  "category" varchar(50) NOT NULL,
  "simplicity" int NOT NULL
);

CREATE TABLE IF NOT EXISTS "instructions" (
  "id" serial primary key,
  "recipe_id" serial NOT NULL,
  "step_number" int NOT NULL,
  "instructions" varchar(500) NOT NULL,
  CONSTRAINT "FK_72" FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id")
);

CREATE TABLE IF NOT EXISTS "recipe_ingredients" (
  "recipe_id" serial NOT NULL,
  "ingredient_id" serial NOT NULL,
  "ingredient_amount" int NOT NULL,
  CONSTRAINT "FK_50" FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id"),
  CONSTRAINT "FK_56" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients" ("id")
);

CREATE UNIQUE INDEX "PK_recipe_reqs" ON "recipe_ingredients" ("ingredient_id", "recipe_id");

CREATE INDEX "kdIdx_90" on recipe_ingredients ("recipe_id");

CREATE INDEX "kdIdx_91" on recipe_ingredients ("ingredient_id");

CREATE TABLE IF NOT EXISTS "recipe_hardware" (
  "recipe_id" serial NOT NULL,
  "hardware_id" serial NOT NULL,
  CONSTRAINT "FK_76" FOREIGN KEY ("hardware_id") REFERENCES "hardware" ("id"),
  CONSTRAINT "FK_79" FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id")
);

CREATE UNIQUE INDEX "PK_recipe_hardware" ON "recipe_hardware" ("hardware_id", "recipe_id");

CREATE INDEX "fkIdx_76" ON "recipe_hardware" ("hardware_id");

CREATE INDEX "fkIdx_79" ON "recipe_hardware" ("recipe_id");