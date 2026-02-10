import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { CatalogStateService } from "../../../../core/services/catalog-state.service";

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
  private readonly stateService = inject(CatalogStateService)

  private readonly _range = signal<PriceRange>(DEFAULT_RANGE)
  private readonly _isDragging = signal(false)
  private readonly _isInputEditing = signal(false);

  readonly range = computed(() => this._range())
  readonly dragging = computed(() => this._isDragging())
  readonly isInputEditing = computed(() => this._isInputEditing());

  prevRange = this.range()

  constructor() {
    effect(() => {
      const range = this.range()
      if (!this._isDragging() && !this.isInputEditing()) {
        this.applyFilter(range.start, range.end)
      }
    })
  }

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

  setDragging(isDragging: boolean) {
    this._isDragging.set(isDragging)
  }

  setInputEditing(isEditing: boolean) {
    this._isInputEditing.set(isEditing);
  }

  private validateStartValue(value: number) {
    if (value < this.range().min) return this.range().min
    if (value > this.range().end) return this.range().end

    return value
  }

  private validateEndValue(value: number) {
    if (value > this.range().max) return this.range().max
    if (value < this.range().start) return this.range().start

    return value
  }

  private applyFilter(start: number, end: number) {
    if (start == DEFAULT_RANGE.min && end == DEFAULT_RANGE.max) {
      return
    } else {
      this.stateService.setPriceRange(start.toString(), end.toString())
    }
  }
}