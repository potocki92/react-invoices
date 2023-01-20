import Link from "next/link";
import { useRouter } from "next/router";
import { MongoClient } from "mongodb";

export default function Home(props) {
  const router = useRouter();
  const { data } = props;

  const navigationPage = () => router.push("/add-new");
  return (
    <div className="main__container">
      <div className="invoice__header">
        <div className="invoice__header-logo">
          <h3>Invoices</h3>
          <p>There are total {data.length} invoices</p>
        </div>

        <button className="btn" onClick={navigationPage}>
          Add New
        </button>
      </div>

      <div className="invoice__container">
        {/* invoice item */}
        {data?.map((invoice) => (
          <Link href={`/invoices/${invoice.id}`}>
            <div className="invoice__item" key={invoice.id}>
              <div>
                <h5 className="invoice__id">{invoice.id}</h5>
              </div>

              <div>
                <h6 className="invoice__client">{invoice.clientName}</h6>
              </div>

              <div>
                <p className="invoice__created">{invoice.createdAt}</p>
              </div>

              <div>
                <h3 className="invoice__total">{invoice.total}</h3>
              </div>

              <div>
                <button
                  className={`${
                    invoice.status === "paid"
                      ? "paid__status"
                      : invoice.status === "pending"
                      ? "pending__status"
                      : "dragt__status"
                  }`}
                >
                  {invoice.status}
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const client = await MongoClient.connect(
    "mongodb+srv://satanista:satanista123@cluster0.zsrttvb.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  );

  const db = client.db();
  const collection = db.collection("Invoices");

  const invoices = await collection.find({}).toArray();

  return {
    props: {
      data: invoices.map((invoice) => {
        return {
          id: invoice._id.toString(),
          clientName: invoice.clientName,
          createdAt: invoice.createdAt,
          total: invoice.total,
          status: invoice.status,
        };
      }),
    },

    // Here revalidate means incremental static generation. It will regenerate the page in every 1 second after deploying. You can use more than 1 second.
    revalidate: 1,
  };
}
