import { NextFunction, Request, Response } from "express";

export type LangCode = 'en' | 'ru' | 'uk';

declare global {
  namespace Express {
    interface Request {
      lang: LangCode
    }
  }
}

export function currentLang(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const currentLang = req.headers['accept-language'] as LangCode
  req.lang = parceLang(currentLang)
  next()
}

function parceLang(header: string | undefined): LangCode {
  if (!header) return 'en'

  const lang = header.split(',')[0].trim().toLowerCase()

  if (['en', 'ru', 'uk'].includes(lang)) {
    return lang as LangCode
  }

  return 'en'
}