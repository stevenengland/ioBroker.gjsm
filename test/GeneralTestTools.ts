import childProcess from 'child_process';

export interface CommandResultInterface {
  exitCode: number | null;
  out: string;
  err: string;
}

export interface CommandOptionsInterface {
  cwd?: string;
  log?: boolean;
  env?: NodeJS.ProcessEnv;
  callback?: (chunk: Buffer, streamSource?: 'stdout' | 'stderr') => void;
}

export const runCommandAsync = (
  command: string,
  args: string[],
  options: CommandOptionsInterface = {},
): Promise<CommandResultInterface> =>
  new Promise((resolve, reject) => {
    const childProc = childProcess.spawn(command, args, { cwd: options.cwd, env: options.env });

    childProc.on('error', (err): void => {
      reject(err);
    });

    const result: CommandResultInterface = {
      exitCode: null,
      err: '',
      out: '',
    };

    childProc.stdout.on('data', (chunk: Buffer): void => {
      result.out += chunk.toString();
      options.callback?.(chunk, 'stdout');
    });

    childProc.stderr.on('data', (chunk: Buffer): void => {
      result.err += chunk.toString();
      options.callback?.(chunk, 'stderr');
    });

    childProc.on('exit', (exitCode): void => {
      result.exitCode = exitCode;
      setTimeout(() => {
        if (exitCode === 0) {
          resolve(result);
        } else {
          // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
          reject(result);
        }
      }, 500);
    });
  });

export function runCommandAsyncInBackground(
  command: string,
  args: string[],
  options: CommandOptionsInterface = {},
): childProcess.ChildProcessWithoutNullStreams {
  const childProc = childProcess.spawn(command, args, { cwd: options.cwd, env: options.env });

  if (options.log) {
    childProc.stdout.on('data', (data) => {
      console.log(`stdout:\n${data}`);
    });
    childProc.stderr.on('data', (data) => {
      console.error(`stderr:\n${data}`);
    });
    childProc.on('error', (error) => {
      console.error(`error:\n${error.message}`);
    });
    childProc.on('close', (code) => {
      console.log(`Process exited with code: ${code}`);
    });
  }

  return childProc;
}
