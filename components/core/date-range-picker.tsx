'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { DateRange } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { CalendarIcon } from 'lucide-react'

interface IProps {
  inputclassName?: string
  selected?: DateRange
  onDateChange?: (event?: DateRange) => void
  disableFutureDate?: boolean
  dateRangeLimit?: number
  type?: 'popover' | 'dropdown'
  changeOnSubmit?: boolean
}

export function DateRangePicker({
  className,
  inputclassName,
  selected,
  onDateChange,
  disableFutureDate,
  type = 'popover',
  dateRangeLimit,
  changeOnSubmit = false
}: React.HTMLAttributes<HTMLDivElement> & IProps) {
  const [internalRange, setInternalRange] = React.useState<DateRange | undefined>(selected)

  React.useEffect(() => {
    setInternalRange(selected)
  }, [selected])

  const displayedRange = selected

  const calendarSelected = changeOnSubmit ? internalRange : selected

  const handleDisabled = (date: Date) => {
    const minDate = new Date('1900-01-01')
    const today = new Date()
    let isDisabled = false

    if (disableFutureDate) {
      isDisabled = date > today || date < minDate
    }

    if (dateRangeLimit && calendarSelected?.from) {
      const start = calendarSelected.from
      const max = new Date(start)
      const min = new Date(start)
      max.setDate(start.getDate() + dateRangeLimit - 1)
      min.setDate(start.getDate() - dateRangeLimit + 1)

      if (date < min || date > max) {
        isDisabled = true
      }
    }

    return isDisabled
  }

  const handleSelect = (range: DateRange | undefined) => {
    if (changeOnSubmit) {
      setInternalRange(range)
    } else {
      if (onDateChange) onDateChange(range)
    }
  }

  const handleSubmit = () => {
    if (onDateChange) onDateChange(internalRange)
  }

  const handleReset = () => {
    if (onDateChange) onDateChange(undefined)
  }

  const renderActionBar = () => (
    <div className="p-4 pt-0 w-full flex gap-2 justify-end">
      <Button size="sm" variant="outline" className={cn('w-full', changeOnSubmit && 'flex-1')} onClick={handleReset}>
        Reset
      </Button>
      {changeOnSubmit && (
        <Button size="sm" className="flex-1" onClick={handleSubmit}>
          Submit
        </Button>
      )}
    </div>
  )

  return (
    <div className={cn('grid gap-2', className)}>
      {type === 'popover' && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={'outline'}
              className={cn(
                'w-full justify-start text-left font-normal',
                !displayedRange && 'text-muted-foreground',
                inputclassName
              )}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {displayedRange?.from ? (
                displayedRange.to ? (
                  <>
                    {format(displayedRange.from, 'LLL dd, y')} - {format(displayedRange.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(displayedRange.from, 'LLL dd, y')
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={calendarSelected?.from}
              selected={calendarSelected}
              disabled={handleDisabled}
              onSelect={handleSelect}
              numberOfMonths={2}
            />
            {renderActionBar()}
          </PopoverContent>
        </Popover>
      )}
      {type === 'dropdown' && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              id="date"
              variant={'outline'}
              className={cn(
                'w-full justify-start text-left font-normal',
                !displayedRange && 'text-muted-foreground',
                inputclassName
              )}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {displayedRange?.from ? (
                displayedRange.to ? (
                  <>
                    {format(displayedRange.from, 'dd MMMM yyyy')} - {format(displayedRange.to, 'dd MMMM yyyy')}
                  </>
                ) : (
                  format(displayedRange.from, 'dd MMMM yyyy')
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-auto p-0">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={calendarSelected?.from}
              selected={calendarSelected}
              disabled={handleDisabled}
              onSelect={handleSelect}
              numberOfMonths={2}
            />
            {renderActionBar()}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
