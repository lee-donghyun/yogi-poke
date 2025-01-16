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
  "authProviderId",
  "passkeyOptions"
FROM
  "User"
WHERE
  ("deletedAt" IS NULL);