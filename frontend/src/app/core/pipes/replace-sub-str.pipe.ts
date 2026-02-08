import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceSubStr'
})
export class ReplaceSubStrPipe implements PipeTransform {

/**
 * Replaces placeholders in a template string with values from a context object.
 * 
 * @param template A string with placeholders (e.g., "Hello, {{name}}!")
 * @param context An object containing key-value pairs to replace (e.g., { name: "Anna" })
 * @param pattern The placeholder format (e.g., '{{}}', '[[]]', '%% %%'). Default is '{{}}'
 */
  transform(template: string, context: Record<string, any>, pattern: string = '{{}}'): string {
    // If template or context is missing, return original string
    if (!template || !context) return template;

    // Split the pattern into opening and closing parts (e.g., '{{' and '}}')
    const [open, close] = this._parsePattern(pattern);

    // Create regex to find all placeholders like {{key}}
    const regex = new RegExp(`${this._escapeRegex(open)}\\s*(\\w+)\\s*${this._escapeRegex(close)}`, 'g');

    // Replace each placeholder with corresponding value from context
    return template.replace(regex, (_, key) => {
      return context[key] != null ? context[key] : '';
    });
  }

  // Splits the pattern string into opening and closing parts
  private _parsePattern(pattern: string): [string, string] {
    const half = Math.floor(pattern.length / 2);
    return [pattern.slice(0, half), pattern.slice(half)];
  }

  // Escapes special regex characters in a string
  private _escapeRegex(str: string): string {
    return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  }
}
