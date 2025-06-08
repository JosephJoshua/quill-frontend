UPDATE "user"
SET "roles" = ARRAY['user', 'admin']::role[]
WHERE "email" = 'jj.anggita@gmail.com';
