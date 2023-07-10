import { Octokit } from 'octokit';

export const octokit = new Octokit({
  auth: process.env.REACT_PUBLIC_GITHUB_TOKEN,
});
