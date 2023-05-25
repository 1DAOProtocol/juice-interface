import { InfoCircleOutlined } from '@ant-design/icons'
import Grid from 'components/Grid'
import Loading from 'components/Loading'
import { useTrendingProjects } from 'hooks/useProjects'
import { classNames } from 'utils/classNames'

import RankingExplanation from './RankingExplanation'
import TrendingProjectCard from './TrendingProjectCard'

export default function TrendingProjects({
  count, // number of trending project cards to show
}: {
  count: number
}) {
  const { data: projects, isLoading } = useTrendingProjects(count)

  // eslint-disable-next-line no-console
  console.log('TRENDINGPROJECTS - projects:', projects)
  // eslint-disable-next-line no-console
  console.log('TRENDINGPROJECTS - !projects?.length:', !projects?.length)
  // eslint-disable-next-line no-console
  console.log('TRENDINGPROJECTS - isLoading:', isLoading)

  return (
    <div>
      {projects && projects.length > 0 && (
        <Grid>
          {projects.map((p, i) => (
            <TrendingProjectCard
              project={p}
              rank={i + 1}
              key={`${p.id}_${p.pv}`}
              size="lg"
            />
          ))}
        </Grid>
      )}

      {projects && projects.length === 0 && (
        <div
          className={classNames(
            'px-5 pb-5 text-center text-grey-400 dark:text-slate-200',
          )}
        >
          0 trending projects
        </div>
      )}

      {isLoading && (
        <div className="mt-10">
          <Loading />
        </div>
      )}

      {/*{(!projects?.length || isLoading) && (*/}
      {/*    <div className="mt-10">*/}
      {/*      <Loading />*/}
      {/*    </div>*/}
      {/*)}*/}

      <p className="my-10 max-w-3xl gap-1">
        <InfoCircleOutlined /> <RankingExplanation />
      </p>
    </div>
  )
}
