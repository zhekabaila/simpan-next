'use client'
import * as React from 'react'
import { Check, ChevronDown, LoaderCircle, Plus, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useEffect, useRef, useState, useCallback } from 'react'

interface IData {
  id: string
  text: string
  value?: string
  disabled?: boolean
  [key: string]: any // Allow additional properties for custom rendering
}

interface IGroupConfig {
  key: string // Key to group by (e.g., 'module')
  labels?: Record<string, string> // Custom labels for each group value
  order?: string[] // Custom order for groups
}

interface IProps {
  data: IData[]
  placeholder: string
  onSelect: (value: string | null, defaultFreeTextMode?: string) => void
  setPageParams?: (pageParams: React.SetStateAction<number>) => void
  loading?: boolean
  fetching?: boolean
  disabled?: boolean
  defaultValue?: string
  enableSearch?: boolean
  searchPlaceholder?: string
  debounceMs?: number
  onSearchChange?: (query: string) => void
  className?: string
  classNameIcon?: string
  disabledLoadMore?: boolean
  renderItem?: (item: IData) => React.ReactNode
  renderSelected?: (item: IData) => React.ReactNode
  showAddNewRow?: {
    text: string
    onClick: () => void
    show: boolean
    icon?: React.ReactNode
    disabled?: boolean
  }
  customDisabled?: (value: string) => boolean
  freeTextMode?: boolean
  allowEmpty?: boolean
  freeTextModeConfig?: {
    label: string
    description: string
    emptyLabel?: string
  }
  groupBy?: IGroupConfig // Enable grouping by a specific key
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function ComboboxV2({
  data,
  placeholder,
  onSelect,
  setPageParams,
  loading,
  fetching,
  disabled,
  defaultValue,
  enableSearch = true,
  searchPlaceholder = 'Search...',
  debounceMs = 300,
  onSearchChange,
  className,
  classNameIcon,
  disabledLoadMore = false,
  renderItem,
  renderSelected,
  showAddNewRow,
  customDisabled,
  allowEmpty,
  freeTextMode,
  freeTextModeConfig,
  groupBy
}: IProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<IData | null>(null)
  const [triggerWidth, setTriggerWidth] = useState(0)

  const triggerRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const isThrottledRef = useRef(false)

  const debouncedSearch = useDebounce(search, debounceMs)

  useEffect(() => {
    if (open && triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth)
    }
  }, [open])

  useEffect(() => {
    if (defaultValue) {
      const matched = data.find((item) => item.id === defaultValue)
      if (matched) {
        setSelected(matched)
      } else if (freeTextMode) {
        setSelected({
          id: defaultValue,
          text: defaultValue,
          value: defaultValue,
        });
      }
    } else if (!!selected) {
      setSelected(null);
    }
  }, [defaultValue, freeTextMode, data])

  useEffect(() => {
    if (onSearchChange) {
      onSearchChange(debouncedSearch)
    }
  }, [debouncedSearch, onSearchChange])

  const handleScroll = () => {
    if (!listRef.current) return
    if (isThrottledRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = listRef.current
    if (scrollTop + clientHeight >= scrollHeight - 5 && !disabledLoadMore) {
      isThrottledRef.current = true
      setPageParams?.((prev) => prev + 1)

      setTimeout(() => {
        isThrottledRef.current = false
      }, 500)
    }
  }

  const handleInputChange = useCallback((query: string) => {
    setSearch(query)
  }, [])

  const handleSelect = useCallback(
    (item: IData) => {
      setSelected(item)
      onSelect(item.id, item.id === item.text ? item.text : undefined);
      setOpen(false)
      setSearch('')
    },
    [onSelect]
  )

  useEffect(() => {
    if (!open) {
      setSearch('')
    }
  }, [open])

  // Group data by the specified key
  const groupedData = React.useMemo(() => {
    if (!groupBy) return null

    const groups: Record<string, IData[]> = {}

    for (const item of data) {
      const groupValue = item[groupBy.key] || 'other'
      if (!groups[groupValue]) {
        groups[groupValue] = []
      }
      groups[groupValue].push(item)
    }

    // Sort groups by custom order if provided
    if (groupBy.order) {
      const orderedGroups: Record<string, IData[]> = {}
      for (const key of groupBy.order) {
        if (groups[key]) {
          orderedGroups[key] = groups[key]
        }
      }
      // Add remaining groups not in order
      for (const key of Object.keys(groups)) {
        if (!orderedGroups[key]) {
          orderedGroups[key] = groups[key]
        }
      }
      return orderedGroups
    }

    return groups
  }, [data, groupBy])

  // Helper to format group label
  const getGroupLabel = (groupKey: string): string => {
    if (groupBy?.labels?.[groupKey]) {
      return groupBy.labels[groupKey]
    }
    // Convert snake_case to Title Case
    return groupKey
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // Render a single item
  const renderDataItem = (item: IData) => {
    const isDisabled = customDisabled?.(item.value || item.text) ?? false

    return (
      <CommandItem
        key={item.id}
        value={item.id}
        disabled={isDisabled || item.disabled}
        onSelect={() => {
          if (isDisabled || item.disabled) return
          handleSelect(item)
        }}
        className={cn(
          'h-auto',
          !!groupBy && 'pl-4',
          (isDisabled || item.disabled) && 'opacity-50 cursor-not-allowed',
          selected?.id === item.id && 'bg-primary/10 hover:bg-primary/20'
        )}
      >
        {renderItem ? renderItem(item) : item.text}

        {!renderItem && !(isDisabled || item.disabled) && (
          <Check
            className={cn(
              'ml-auto',
              selected?.id === item.id ? 'opacity-100' : 'opacity-0'
            )}
          />
        )}
      </CommandItem>
    )
  }

  return (
    <DropdownMenu 
      open={open} 
      onOpenChange={(next) => { 
        if (disabled) return; 
        setOpen(next) 
      }}
      >
      <DropdownMenuTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'bg-card w-full justify-between text-sm leading-none font-normal text-muted-foreground !px-3',
            className
          )}
          disabled={disabled}
        >
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
            {selected
              ? renderSelected
                ? renderSelected(selected)
                : freeTextMode ? selected.value || selected.text : selected.text
              : placeholder}
          </span>
          <ChevronDown className={cn('opacity-50 flex-shrink-0 w-5 h-5', classNameIcon)} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-full p-0"
        align="start"
        side="bottom"
        style={{ width: triggerWidth }}
      >
        <Command shouldFilter={false}>
          {enableSearch && (
            <CommandInput
              placeholder={searchPlaceholder}
              onValueChange={handleInputChange}
              value={search}
              autoFocus={true}
              autoComplete="off"
            />
          )}
          <CommandList
            ref={listRef}
            onScroll={handleScroll}
            className="relative"
          >
            {loading && <CommandEmpty>Loading...</CommandEmpty>}
            {fetching && (
              <div className="absolute inset-0 flex justify-center items-center gap-3 bg-background/5 backdrop-blur-xs z-10">
                <LoaderCircle className="w-4 h-4 animate-spin" /> Please wait...
              </div>
            )}
            {!freeTextMode && !loading && (data.length === 0) && (
              <CommandEmpty>
                {search
                  ? `No results found for "${search}"`
                  : 'No options found.'}
              </CommandEmpty>
            )}

            {/* Add New Row - always at top */}
            {showAddNewRow?.show && (
              <CommandGroup>
                <CommandItem
                  key="__add_new__"
                  value="__add_new__"
                  onSelect={() => {
                    showAddNewRow?.onClick()
                  }}
                  disabled={showAddNewRow?.disabled || false}
                  className="justify-center font-medium text-primary hover:text-primary/90 gap-2 items-center data-[selected=true]:text-primary/70"
                >
                  <div className="flex items-center gap-2">
                    {showAddNewRow?.icon ? (
                      showAddNewRow.icon
                    ) : (
                      <Plus className="opacity-50" />
                    )}
                    {showAddNewRow.text}
                  </div>
                </CommandItem>
              </CommandGroup>
            )}

            {/* Free text mode item */}
            {freeTextMode && (
              <CommandGroup>
                <CommandItem
                  value={search}
                  disabled={disabled}
                  onSelect={() => {
                    if (disabled) return
                    if (search.length > 0) {
                      handleSelect({
                        id: search,
                        text: search,
                        value: search,
                      })
                    } else onSelect('', '');
                  }}
                  className={cn(
                    'h-auto hover:bg-background',
                    disabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <div className="size-6 rounded-lg bg-primary/20 grid place-items-center">
                    <Plus className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">
                      {search.length > 0 ? (
                        <>
                          {freeTextModeConfig?.label || 'Select For'} <span className="font-semibold">&apos;{search}&apos;</span>
                        </>
                      ) : freeTextModeConfig?.emptyLabel || 'Add New Data'}
                    </p>
                    {freeTextModeConfig?.description && (search.length > 0) && (
                      <span className="text-xs text-muted-foreground">
                        {freeTextModeConfig.description}
                      </span>
                    )}
                  </div>
                </CommandItem>
              </CommandGroup>
            )}

            {/* Allow Empty / Clear Selection */}
            {allowEmpty && !!selected && (
              <CommandGroup>
                <CommandItem
                  value="__clear_selection__"
                  disabled={disabled}
                  onSelect={() => {
                    if (disabled) return
                    setSelected(null)
                    onSelect(null)
                    setOpen(false)
                  }}
                  className={cn(
                    'gap-2 text-destructive hover:text-destructive data-[selected=true]:text-destructive data-[selected=true]:bg-destructive/10',
                    disabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <div className="size-6 rounded-lg bg-destructive/10 grid place-items-center flex-shrink-0">
                    <X className="w-3.5 h-3.5 text-destructive" />
                  </div>
                  <span className="font-medium text-sm">Clear Selection</span>
                </CommandItem>
              </CommandGroup>
            )}

            {/* Grouped rendering */}
            {groupedData && Object.entries(groupedData).map(([groupKey, items]) => (
              <CommandGroup 
                key={groupKey} 
                heading={getGroupLabel(groupKey)} 
                className="[&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-foreground [&_[cmdk-group-heading]]:text-sm [&_[cmdk-group-heading]]:py-2"
              >
                {items.map(renderDataItem)}
              </CommandGroup>
            ))}

            {/* Non-grouped rendering */}
            {!groupedData && (
              <CommandGroup>
                {data.map(renderDataItem)}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
