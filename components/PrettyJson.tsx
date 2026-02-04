type TProps = {
  json: any;
  title?: string;
};

export default function PrettyJson({ json, title = '' }: TProps) {
  return (
    <div>
      {title && <h4>{title}</h4>}
      <pre>{JSON.stringify(json, null, 2)}</pre>
    </div>
  );
}
