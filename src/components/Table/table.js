import axios from "../../config/axios";

const Table = ({ data }) => {

    const onClickView = async (fileName) => {
        const response = await axios.post('/pdf', { fileName }, {
            responseType: 'blob'
        });
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    }

    return (
        <div className="container mb-4">
            {data && data.length > 0 ?
                <div className="row">
                    <div className="col-12">
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col">Tên cơ quan</th>
                                        <th scope="col">Số văn bản</th>
                                        <th scope="col">Địa điểm</th>
                                        <th scope="col">Thời gian</th>
                                        <th scope="col">Loại</th>
                                        <th scope="col">Nội dung</th>
                                        <th> </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((pdf, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{pdf.name}</td>
                                                <td>{pdf.number}</td>
                                                <td>{pdf.adress}</td>
                                                <td>{pdf.date}</td>
                                                <td>{pdf.type}</td>
                                                <td className="text-right">{pdf.content}</td>
                                                <td className="text-right">
                                                    <button className="btn btn-sm btn-primary col-12"
                                                        onClick={() => onClickView(pdf.fileName)}>VIEW
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                :
                <div className='d-flex justify-content-center '>Don't exist PDF with keyword.........</div>
            }

        </div>

    )
}

export default Table;