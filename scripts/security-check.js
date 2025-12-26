#!/usr/bin/env node

/**
 * Script de validação de segurança
 * Verifica se todas as configurações de segurança estão corretas
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const checks = {
    passed: [],
    failed: [],
    warnings: []
};

console.log('🔒 Verificando configurações de segurança...\n');

// 1. Verificar se .env existe e não está vazio
try {
    const envPath = path.join(__dirname, '..', '.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        if (envContent.includes('MERCADO_PAGO_ACCESS_TOKEN=')) {
            checks.passed.push('✅ Arquivo .env encontrado');

            if (envContent.includes('MERCADO_PAGO_ACCESS_TOKEN=seu_access_token_aqui')) {
                checks.failed.push('❌ Access Token não configurado no .env');
            } else {
                checks.passed.push('✅ Access Token configurado');
            }
        } else {
            checks.failed.push('❌ MERCADO_PAGO_ACCESS_TOKEN não encontrado no .env');
        }
    } else {
        checks.warnings.push('⚠️  Arquivo .env não encontrado (necessário para produção)');
    }
} catch (error) {
    checks.warnings.push('⚠️  Não foi possível verificar .env');
}

// 2. Verificar se .env está no .gitignore
try {
    const gitignorePath = path.join(__dirname, '..', '.gitignore');
    if (fs.existsSync(gitignorePath)) {
        const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
        if (gitignoreContent.includes('.env')) {
            checks.passed.push('✅ .env está no .gitignore');
        } else {
            checks.failed.push('❌ .env NÃO está no .gitignore - RISCO DE SEGURANÇA!');
        }
    }
} catch (error) {
    checks.warnings.push('⚠️  Não foi possível verificar .gitignore');
}

// 3. Verificar se há credenciais hardcoded nos arquivos
const filesToCheck = [
    'netlify/functions/create-payment.js',
    'netlify/functions/check-status.js'
];

filesToCheck.forEach(file => {
    try {
        const filePath = path.join(__dirname, '..', file);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');

            // Procurar por padrões de Access Token hardcoded
            if (content.match(/APP_USR-[a-zA-Z0-9-]+/)) {
                checks.failed.push(`❌ Access Token hardcoded encontrado em ${file}`);
            } else if (content.includes('process.env.MERCADO_PAGO_ACCESS_TOKEN')) {
                checks.passed.push(`✅ ${file} usa variável de ambiente`);
            }
        }
    } catch (error) {
        checks.warnings.push(`⚠️  Não foi possível verificar ${file}`);
    }
});

// 4. Verificar netlify.toml
try {
    const netlifyTomlPath = path.join(__dirname, '..', 'netlify.toml');
    if (fs.existsSync(netlifyTomlPath)) {
        const content = fs.readFileSync(netlifyTomlPath, 'utf8');

        if (content.includes('X-Frame-Options')) {
            checks.passed.push('✅ Headers de segurança configurados');
        } else {
            checks.warnings.push('⚠️  Headers de segurança podem estar incompletos');
        }

        if (content.includes('Content-Security-Policy')) {
            checks.passed.push('✅ CSP configurado');
        } else {
            checks.warnings.push('⚠️  Content Security Policy não encontrado');
        }
    }
} catch (error) {
    checks.warnings.push('⚠️  Não foi possível verificar netlify.toml');
}

// 5. Verificar package.json para dependências vulneráveis conhecidas
try {
    const packagePath = path.join(__dirname, '..', 'package.json');
    if (fs.existsSync(packagePath)) {
        checks.passed.push('✅ package.json encontrado');
        checks.warnings.push('⚠️  Execute "npm audit" para verificar vulnerabilidades');
    }
} catch (error) {
    checks.warnings.push('⚠️  Não foi possível verificar package.json');
}

// Exibir resultados
console.log('\n📊 Resultados da Verificação:\n');

if (checks.passed.length > 0) {
    console.log('✅ PASSOU:');
    checks.passed.forEach(msg => console.log(`   ${msg}`));
    console.log('');
}

if (checks.warnings.length > 0) {
    console.log('⚠️  AVISOS:');
    checks.warnings.forEach(msg => console.log(`   ${msg}`));
    console.log('');
}

if (checks.failed.length > 0) {
    console.log('❌ FALHOU:');
    checks.failed.forEach(msg => console.log(`   ${msg}`));
    console.log('');
    console.log('🚨 AÇÃO NECESSÁRIA: Corrija os problemas acima antes de fazer deploy!\n');
    process.exit(1);
} else {
    console.log('✅ Todas as verificações de segurança passaram!\n');
    console.log('📝 Próximos passos:');
    console.log('   1. Execute "npm audit" para verificar dependências');
    console.log('   2. Configure as variáveis de ambiente no Netlify');
    console.log('   3. Teste o CORS com seu domínio de produção\n');
    process.exit(0);
}
