import { computed, Injectable, signal } from "@angular/core";

export interface PriceRange {
  min: number;
  max: number;
  start: number;
  end: number;
}

const DEFAULT_RANGE = {
  min: 0,
  max: 6000,
  start: 0,
  end: 5500,
}

@Injectable()

export class PriceFacade {
  private readonly _range = signal<PriceRange>(DEFAULT_RANGE)
  readonly range = computed(() => this._range())

  setStartValue(value: number) {
    const validatedValue = this.validateStartValue(value)

    this._range.update(v => {
      return {
        ...v,
        start: validatedValue
      }
    }) 
  }

  setEndValue(value: number) {
    const validateValue = this.validateEndValue(value) 
    this._range.update(v => {
      return {
        ...v,
        end: validateValue
      }
    })
  }

  private validateStartValue(value: number) {
    if(value < this.range().min) return this.range().min
    if(value > this.range().end) return this.range().end

    return value
  }

  private validateEndValue(value: number) {
    if(value > this.range().max) return this.range().max
    if(value < this.range().start) return this.range().start

    return value
  }
}