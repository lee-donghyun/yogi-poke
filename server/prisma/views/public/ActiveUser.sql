SELECT
  id,
  "createdAt",
  name,
  email,
  PASSWORD,
  "pushSubscription",
  "profileImageUrl",
  "referrerId",
  "deletedAt",
  "authProvider",
  "authProviderId"
FROM
  "User"
WHERE
  ("deletedAt" IS NULL);