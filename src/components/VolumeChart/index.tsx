import { t, Trans } from '@lingui/macro'
import CurrencySymbol from 'components/currency/CurrencySymbol'
import { JuiceListbox } from 'components/inputs/JuiceListbox'
import { JUICE_ORANGE } from 'constants/theme/colors'
import { PV } from 'models/pv'
import moment from 'moment'
import { SVGProps, useEffect, useMemo, useState } from 'react'
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { classNames } from 'utils/classNames'
import { daysToMillis } from './daysToMillis'
import { useDuration } from './hooks/useDuration'
import { loadBlockRefs } from './loadBlockRefs'
import { loadDomain } from './loadDomain'
import { loadProjectEvents } from './loadProjectEvents'
import { loadTapEvents } from './loadTapEvents'
import { Duration, EventRef, ShowGraph } from './types'

const now = moment.now() - 5 * 60 * 1000 // 5 min ago

export default function VolumeChart({
  style: { height },
  createdAt,
  projectId,
  pv,
}: {
  style: { height: number }
  createdAt: number | undefined
  projectId: number | undefined
  pv: PV
}) {
  const [events, setEvents] = useState<EventRef[]>([])
  // const [blockRefs, setBlockRefs] = useState<BlockRef[]>([])
  const [loading, setLoading] = useState<boolean>()
  const [domain, setDomain] = useState<[number, number]>()
  const [showGraph, setShowGraph] = useState<ShowGraph>('volume')
  const [duration, setDuration] = useDuration({ createdAt, now })

  const dateStringForBlockTime = (timestamp: number) =>
    duration
      ? moment(timestamp * 1000).format(duration > 1 ? 'M/DD' : 'h:mma')
      : undefined

  // Get references to timestamp of blocks in interval
  useEffect(() => {
    if (!duration || !showGraph) return

    setLoading(true)
    setEvents([])
    setDomain(undefined)

    loadBlockRefs({ duration, now }).then(async blockRefs => {
      if (!projectId) return
      const projectEvents = await loadProjectEvents({
        blockRefs,
        showGraph,
        projectId,
        pv,
      })
      if (!projectEvents) return
      const domain = loadDomain(projectEvents)
      setDomain(domain)
      if (showGraph === 'balance') {
        const tapEvents = await loadTapEvents({ projectId, duration, now })
        projectEvents.concat(tapEvents)
      }
      const sortedEvents = projectEvents.sort((a, b) =>
        a.timestamp < b.timestamp ? -1 : 1,
      )
      const events = sortedEvents.map((e, i) => {
        if (e.tapped) {
          return { ...e, previousBalance: sortedEvents[i - 1]?.value }
        }
        return e
      })
      setEvents(events)
      setLoading(false)
    })
    // loadEvents(blockRefs)
  }, [pv, duration, projectId, showGraph])

  const durationSelection: DurationOption = useMemo(() => {
    return (
      durationOptions?.find(o => o.value === duration) ?? durationOptions[0]
    )
  }, [duration])

  const axisStyle: SVGProps<SVGTextElement> = {
    fontSize: '0.75rem',
    fill: '#A3A3A3', // grey-400
    visibility: events?.length ? 'visible' : 'hidden',
  }

  const xTicks = useMemo(() => {
    if (!events?.length) return []

    const ticks = []
    const max = now / 1000
    const min = duration ? (now - daysToMillis(duration)) / 1000 : undefined

    if (!min) return []

    for (let i = 0; i < 20; i++) {
      ticks.push(Math.round(((max - min) / 20) * i + min))
    }

    return ticks
  }, [events, duration])

  const tab = (tab: ShowGraph) => {
    const selected = tab === showGraph

    let text: string
    switch (tab) {
      case 'balance':
        text = t`Balance`
        break
      case 'volume':
        text = t`Volume`
        break
    }

    return (
      <div
        className={classNames(
          'cursor-pointer text-sm uppercase',
          selected
            ? 'font-medium text-grey-500 dark:text-grey-300'
            : 'font-normal text-grey-400 dark:text-slate-200',
        )}
        onClick={() => setShowGraph(tab)}
      >
        {text}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div>
          <div className="flex gap-6">
            {tab('volume')}
            {tab('balance')}
          </div>
        </div>

        <JuiceListbox
          className="w-24"
          buttonClassName="uppercase bg-transparent dark:bg-transparent text-secondary py-1.5 pr-0 text-xs dark:text-slate-200 font-medium dark:border-slate-400"
          options={durationOptions}
          value={durationSelection}
          onChange={d => setDuration(d.value)}
        />
      </div>
      <div className="relative">
        <ResponsiveContainer width={'100%'} height={height}>
          <LineChart
            className={classNames(loading ? 'opacity-50' : '')}
            data={events}
          >
            {showGraph === 'balance' && (
              <Line
                dot={props => {
                  const { cx, payload } = props

                  return payload.tapped && domain ? (
                    <g transform={`translate(${cx},${0})`}>
                      <line
                        x1="0"
                        y1={
                          80 -
                          (payload.tapped * 25) / (domain[1] - domain[0]) +
                          '%'
                        }
                        x2="0"
                        y2={height - 35 + 'px'}
                        strokeWidth={4}
                      />
                    </g>
                  ) : (
                    <span hidden></span>
                  )
                }}
                activeDot={false}
                strokeWidth={0}
                dataKey="previousBalance"
              />
            )}
            <Line
              dot={false}
              connectNulls
              stroke={JUICE_ORANGE}
              strokeWidth={2}
              type="monotone"
              dataKey="value"
              animationDuration={0}
            />
            <YAxis
              axisLine={false}
              stroke="#CFD9FA" // grey-400
              type="number"
              dataKey="value"
              domain={domain}
              scale="linear"
              tickSize={2}
              tickCount={4}
              tick={axisStyle}
              mirror
            />
            <XAxis
              axisLine={false}
              tickSize={4}
              stroke="#CFD9FA" // grey-400
              ticks={xTicks}
              tickCount={xTicks.length}
              tick={props => {
                const { x, y, payload } = props
                return (
                  <g transform={`translate(${x},${y})`}>
                    <text dy={12} {...axisStyle}>
                      {dateStringForBlockTime(payload.value)}
                    </text>
                  </g>
                )
              }}
              domain={[xTicks[0], xTicks[xTicks.length - 1]]}
              type="number"
              dataKey="timestamp"
              scale="time"
              interval={2}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null

                return (
                  <div className="border border-smoke-200 bg-smoke-25 p-2 text-xs dark:border-grey-600 dark:bg-slate-800">
                    <div className="text-grey-400 dark:text-slate-200">
                      {dateStringForBlockTime(payload[0].payload.timestamp)}
                    </div>
                    {payload[0].payload.tapped ? (
                      <div>
                        -<CurrencySymbol currency="ETH" />{' '}
                        {payload[0].payload.tapped}
                        <div className="text-xs font-medium text-grey-500 dark:text-grey-300">
                          withdraw
                        </div>
                      </div>
                    ) : (
                      <div>
                        <CurrencySymbol currency="ETH" />{' '}
                        {payload[0].payload.value}
                      </div>
                    )}
                  </div>
                )
              }}
              animationDuration={100}
            />
          </LineChart>
        </ResponsiveContainer>

        {loading && (
          <div className="absolute left-0 right-0 top-0 bottom-5 flex items-center justify-center">
            <div className="text-grey-400 dark:text-slate-200">
              <Trans>loading</Trans>...
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface DurationOption {
  label: string
  value: Duration
}

const durationOptions: DurationOption[] = [
  { label: '24 hours', value: 1 },
  { label: '7 days', value: 7 },
  { label: '30 days', value: 30 },
  { label: '90 days', value: 90 },
  { label: '1 year', value: 365 },
]
