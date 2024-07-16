SELECT
  id,
  "createdAt",
  name,
  email,
  PASSWORD,
  "pushSubscription",
  "profileImageUrl",
  "referrerId",
  "deletedAt"
FROM
  "User"
WHERE
  ("deletedAt" IS NULL);