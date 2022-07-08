import { createReadStream } from 'fs'

type ICsvData = {
  [key: string]: any
}

async function read_csv(csv_file_path: string): Promise<ICsvData[]> {
  const data: ICsvData[] = []
  return new Promise((resolve, reject) => {
    createReadStream(csv_file_path)
      .pipe(csvtojson())
      .on('data', function (d) {
        const jsonStr = d.toString('utf8')
        data.push(jsonStr)
      })
      .on('end', function () {
        resolve(data)
      })
    // .on('error', function (err) {
    //   reject(err)
    // })
  })
}

export { read_csv }
