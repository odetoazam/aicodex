-- Add practical_example column to terms table
-- Plain-English scenario showing what the term looks like in practice

alter table terms
  add column if not exists practical_example text;
