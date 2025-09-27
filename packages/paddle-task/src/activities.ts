export async function greet(name: string): Promise<string> {
  await Promise.resolve();
  return `Hello, ${name}!`;
}
