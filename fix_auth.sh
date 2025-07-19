#!/bin/bash
# Remove all isAuthenticated middleware references since Firebase handles auth
sed -i 's/isAuthenticated,\s*//g' server/routes.ts
sed -i 's/,\s*isAuthenticated//g' server/routes.ts
sed -i '/^\s*isAuthenticated,\s*$/d' server/routes.ts