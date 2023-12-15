import { ResponsivePie } from '@nivo/pie';

export default function PieChart({ data, theme }: any) {
  return (
    <ResponsivePie
      data={data}
      theme={theme}
      margin={{ top: 20, bottom: 80 }}
      innerRadius={0}
      padAngle={0.7}
      cornerRadius={2}
      activeOuterRadiusOffset={8}
      borderWidth={1}
      borderColor={{
        from: 'color',
        modifiers: [['darker', 0.2]]
      }}
      arcLabelsTextColor={{
        from: 'color',
        modifiers: [['darker', 2]]
      }}
      legends={[
        {
          anchor: 'bottom',
          direction: 'row',
          justify: false,
          translateX: 0,
          translateY: 56,
          itemsSpacing: 0,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: '#999',
          itemDirection: 'left-to-right',
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: 'circle'
        }
      ]}
    />
  );
}
