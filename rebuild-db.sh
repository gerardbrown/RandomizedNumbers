#!/bin/bash
echo -e "\n\n"
php ./vendor/doctrine/orm/bin/doctrine orm:schema-tool:drop --force
php ./vendor/doctrine/orm/bin/doctrine orm:schema-tool:create
php ./vendor/doctrine/orm/bin/doctrine orm:generate-proxies
rm -rf data/DoctrineORMModule/Proxy/__CG__*
mv /tmp/__CG__* data/DoctrineORMModule/Proxy/
echo -e "\nRunning fixtures..."
php ./public/index.php fixture build
echo -e "\nKicking the cache..."
rm -rf data/cache/module*
