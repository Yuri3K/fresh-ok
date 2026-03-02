export function replaceSubStr(template: string, context: Record<string, string>): string {
  let result = template;

  if(!result) return template

  for (const key in context) {
    const placeholder = `{{${key}}}`;
    result = result.split(placeholder).join(context[key] ?? '');
  }

  return result;
}
