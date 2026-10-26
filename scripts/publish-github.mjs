import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const repoName='karachi-apartment-studio';
function run(bin,args,{capture=false,allowFailure=false}={}) {
 const result=spawnSync(bin,args,{cwd:root,encoding:'utf8',stdio:capture?'pipe':'inherit'});
 if(result.error)throw result.error;
 if(result.status!==0&&!allowFailure)throw Error(`${bin} ${args.slice(0,3).join(' ')} failed.${capture?' '+result.stderr.trim():''}`);
 return result;
}
const gh=(args,options)=>run('gh',args,options);
const api=(endpoint)=>JSON.parse(gh(['api',endpoint],{capture:true}).stdout);
try {
 if(gh(['auth','status'],{capture:true,allowFailure:true}).status!==0) {
  console.log('Sign in to GitHub in the browser to create your private repository.');
  gh(['auth','login','--hostname','github.com','--web','--git-protocol','https','--scopes','repo,workflow']);
 }
 const user=api('user');
 const fullName=`${user.login}/${repoName}`;
 console.log(`Preparing PRIVATE repository: ${fullName}`);
 run('npm',['ci']);
 run('npm',['run','validate']);
 run('npm',['run','build']);
 if(!existsSync(path.join(root,'.git')))run('git',['init','-b','main']);
 const branch=run('git',['branch','--show-current'],{capture:true}).stdout.trim();
 if(branch!=='main')throw Error(`Expected main branch; found ${branch}. No repository was published.`);
 const remote=run('git',['remote','get-url','origin'],{capture:true,allowFailure:true});
 if(remote.status===0) {
  const expected=[`https://github.com/${fullName}.git`,`https://github.com/${fullName}`,`git@github.com:${fullName}.git`];
  if(!expected.includes(remote.stdout.trim()))throw Error('Origin points to a different repository. No changes were pushed.');
  if(!api(`repos/${fullName}`).private)throw Error('The existing repository is public. Publishing stopped to preserve your private-repository requirement.');
 }
 run('git',['add','--','.']);
 const changes=run('git',['diff','--cached','--quiet'],{capture:true,allowFailure:true});
 if(changes.status===1)run('git',['-c',`user.name=${user.name||user.login}`,'-c',`user.email=${user.id}+${user.login}@users.noreply.github.com`,'commit','-m','Publish Karachi apartment walkthrough and design studio']);
 else if(changes.status!==0)throw Error('Could not inspect staged changes.');
 if(remote.status!==0) {
  // Fails safely if the name already belongs to another repository; never adopts it implicitly.
  gh(['repo','create',fullName,'--private','--description','Blueprint-based Karachi apartment walkthrough and interior design studio','--source',root,'--remote','origin']);
 }
 if(!api(`repos/${fullName}`).private)throw Error('Private repository verification failed. No source was pushed.');
 run('git',['-c','credential.helper=','-c','credential.helper=!gh auth git-credential','push','--set-upstream','origin','main']);
 console.log(`Private source repository: https://github.com/${fullName}`);
 const pages=gh(['api',`repos/${fullName}/pages`],{capture:true,allowFailure:true});
 if(pages.status===0) {
  if(JSON.parse(pages.stdout).build_type!=='workflow')gh(['api','--method','PUT',`repos/${fullName}/pages`,'-f','build_type=workflow']);
 } else {
  const create=gh(['api','--method','POST',`repos/${fullName}/pages`,'-f','build_type=workflow'],{capture:true,allowFailure:true});
  if(create.status!==0)throw Error(`The private repository is uploaded, but GitHub Pages could not be enabled. Private-repository Pages requires an eligible paid plan. The repository was kept private. GitHub response: ${create.stderr.trim()}`);
 }
 // Dispatch explicitly because the first push may have preceded Pages enablement.
 let dispatched=false;
 for(let attempt=0;attempt<6;attempt++) {
  const result=gh(['workflow','run','deploy.yml','--repo',fullName,'--ref','main'],{capture:true,allowFailure:true});
  if(result.status===0){dispatched=true;break;}
  await new Promise(resolve=>setTimeout(resolve,2000));
 }
 if(!dispatched)throw Error(`Repository and Pages are configured. Open https://github.com/${fullName}/actions and run the deployment workflow.`);
 await new Promise(resolve=>setTimeout(resolve,3000));
 const runs=JSON.parse(gh(['run','list','--repo',fullName,'--workflow','deploy.yml','--event','workflow_dispatch','--limit','1','--json','databaseId'],{capture:true}).stdout);
 if(!runs.length)throw Error(`Deployment queued. Follow progress at https://github.com/${fullName}/actions`);
 gh(['run','watch',String(runs[0].databaseId),'--repo',fullName,'--exit-status']);
 const site=api(`repos/${fullName}/pages`);
 console.log(`\nPRIVATE REPOSITORY: https://github.com/${fullName}\nLIVE WEBSITE: ${site.html_url}\nThe website is public; the source repository remains private.`);
} catch(error) {
 console.error(`\nPublishing stopped: ${error.message}`);
 process.exitCode=1;
}
