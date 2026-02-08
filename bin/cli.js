#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { program } from 'commander';
import dotenv from 'dotenv';
import { languageOptions } from '../src/utils/constant.js';

dotenv.config();

program
  .name('tech-run')
  .description('Execute code files via Tech Compiler API')
  .version('1.0.0')
  .argument('<file>', 'File to execute')
  .option('-l, --language <lang>', 'Programming language (e.g., python, javascript, cpp)')
  .action(async (file, options) => {
    try {
      const filePath = path.resolve(file);
      if (!fs.existsSync(filePath)) {
        console.error(`Error: File not found at ${filePath}`);
        process.exit(1);
      }

      const sourceCode = fs.readFileSync(filePath, 'utf-8');
      
      const ext = path.extname(file).replace('.', '');
      const langKey = options.language || mapExtensionToLanguage(ext);
      
      const selectedLanguage = languageOptions[langKey];
      if (!selectedLanguage) {
        console.error(`Error: Unsupported language "${langKey}". Use -l to specify.`);
        process.exit(1);
      }

      console.log(`Running ${file} (${selectedLanguage.name})...`);
      await runCode(selectedLanguage.id, sourceCode);

    } catch (err) {
      console.error('CLI Error:', err.message);
    }
  });

function mapExtensionToLanguage(ext) {
  const map = {
    'js': 'javascript',
    'py': 'python',
    'cpp': 'cpp',
    'c': 'c',
    'java': 'java',
    'rb': 'ruby',
    'go': 'go'
  };
  return map[ext] || null;
}

async function runCode(languageId, code) {
  const apiKey = process.env.VITE_API_TOKENS 
    ? JSON.parse(process.env.VITE_API_TOKENS)[0] 
    : "YOUR_FALLBACK_KEY";
  
  const host = process.env.VITE_RAP_API_HOST || "judge0-ce.p.rapidapi.com";
  const url = process.env.VITE_RAPID_API_URL || "https://judge0-ce.p.rapidapi.com/submissions";

  try {
    const response = await axios.post(url, {
      language_id: languageId,
      source_code: Buffer.from(code).toString('base64'),
    }, {
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Host": host,
        "X-RapidAPI-Key": apiKey,
      }
    });

    const token = response.data.token;
    
    let result = null;
    while (!result) {
      const statusRes = await axios.get(`${url}/${token}`, {
        params: { base64_encoded: "true", fields: "*" },
        headers: { "X-RapidAPI-Host": host, "X-RapidAPI-Key": apiKey }
      });

      const statusId = statusRes.data.status?.id;
      if (statusId > 2) {
        result = statusRes.data;
      } else {
        await new Promise(res => setTimeout(res, 1000));
      }
    }

    if (result.stdout) console.log(Buffer.from(result.stdout, 'base64').toString());
    if (result.stderr) console.error('Error:', Buffer.from(result.stderr, 'base64').toString());
    if (result.compile_output) console.error('Compile Error:', Buffer.from(result.compile_output, 'base64').toString());
    
  } catch (error) {
    console.error('Execution Failed:', error.response?.data?.message || error.message);
  }
}

program.parse();