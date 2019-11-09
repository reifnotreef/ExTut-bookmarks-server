CREATE TABLE "ingredients" (
  "id" int NOT NULL GENERATED ALWAYS AS IDENTITY,
  "name" varchar(50) NOT NULL
);

CREATE UNIQUE INDEX "PK_ingredients" ON "ingredients" ("id");

CREATE TABLE "hardware" (
  "id" int NOT NULL GENERATED ALWAYS AS IDENTITY,
  "name" varchar(50) NOT NULL
);

CREATE UNIQUE INDEX "PK_hardware" ON "hardware" ("id");

CREATE TABLE "recipes" (
  "id" int NOT NULL GENERATED ALWAYS AS IDENTITY,
  "name" varchar(50) NOT NULL,
  "prep_time" int NOT NULL,
  "cook_time" int NOT NULL,
  "category" varchar(50) NOT NULL,
  "simplicity" int NOT NULL,
  (
    CHECK simplicity BETWEEN 1
    and 5
  )
);

CREATE UNIQUE INDEX "PK_recipes" ON "recipes" ("id");

CREATE TABLE "instructions" (
  "id" int NOT NULL GENERATED ALWAYS AS IDENTITY,
  "recipe_id" int NOT NULL,
  "step_number" int NOT NULL,
  "instructions" varchar(500) NOT NULL,
  CONSTRAINT "FK_72" FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id")
);

CREATE UNIQUE INDEX "PK_instructions" ON "instructions" ("id");

CREATE INDEX "fkIdx_72" ON "instructions" ("recipe_id");

CREATE TABLE "recipe_ingredients" (
  "recipe_id" int NOT NULL,
  "ingredient_id" int NOT NULL,
  "ingredient_amount" int NOT NULL,
  CONSTRAINT "FK_50" FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id"),
  CONSTRAINT "FK_56" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients" ("id")
);

CREATE UNIQUE INDEX "PK_recipe_reqs" ON "recipe_ingredients" ("ingredient_id", "recipe_id");

CREATE INDEX "fkIdx_56" ON "recipe_ingredients" ("ingredient_id");

CREATE TABLE "recipe_hardware" (
  "recipe_id" int NOT NULL,
  "hardware_id" int NOT NULL,
  CONSTRAINT "FK_76" FOREIGN KEY ("hardware_id") REFERENCES "hardware" ("id"),
  CONSTRAINT "FK_79" FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id")
);

CREATE UNIQUE INDEX "PK_recipe_hardware" ON "recipe_hardware" ("hardware_id", "recipe_id");

CREATE INDEX "fkIdx_76" ON "recipe_hardware" ("hardware_id");

CREATE INDEX "fkIdx_79" ON "recipe_hardware" ("recipe_id");