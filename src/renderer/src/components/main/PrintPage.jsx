import React from 'react'
import styles from './index.module.css'

const PrintPage = React.forwardRef(
  ({ employeeData, employeeParentAddress, employeeSubAddress, doctor, nurse }, ref) => {
    return (
      <div ref={ref} className="paper">
        <div className={`wrapper ${styles.wrapper}`}>
          <div>
            <h3 className={`header ${styles.header}`}>Ерөнхий мэдээлэл</h3>
          </div>
          <div className={`gridWrapper ${styles.gridWrapper}`}>
            <div>
              <div className={`subGrid ${styles.subGrid}`}>
                <div>Эмнэлгийн 123 нэр</div>
                <b>{employeeData?.hospitalName}</b>

                <div>Тасгийн нэр</div>
                <b>{employeeData?.departmentName}</b>
              </div>
            </div>
            <div>
              <div className={`subGrid ${styles.subGrid}`}>
                <div>Өвчтөний байдал</div>
                <b>{employeeData?.patientCondition}</b>

                <div>Заалт</div>
                <b>{employeeData?.diseaseIndication}</b>

                <div>Мэдээ алдууулалт</div>
                <b>{employeeData?.anesthesia}%</b>
              </div>
            </div>
          </div>

          <div>
            <h3 className={`header ${styles.header}`}>Өвчтөний мэдээлэл</h3>
          </div>

          <div className={`gridWrapper ${styles.gridWrapper}`}>
            <div className={`subGrid ${styles.subGrid}`}>
              <div>Нэр:</div>
              <b>
                {employeeData?.lastName?.[0]}. {employeeData?.firstName}
              </b>

              <div>Регистрийн дугаар:</div>
              <b>{employeeData?.regNo}</b>

              <div>Төгсөн огноо:</div>
              <b>{employeeData?.birthDate}</b>

              <div>Нас:</div>
              <b>{employeeData?.age}</b>

              <div>Хүйс:</div>
              <b>
                {employeeData?.gender === 'male'
                  ? 'Эр'
                  : employeeData?.gender === 'female'
                    ? 'Эм'
                    : 'Бусад'}
              </b>
            </div>

            <div>
              <div className={`subGrid ${styles.subGrid}`}>
                <div>Хаяг:</div>
                <b>
                  {employeeParentAddress?.name}, {employeeSubAddress?.name}, {employeeData?.address}
                </b>

                <div>Утасны дугаар:</div>
                <b>{employeeData?.phoneNumber}</b>

                <div>Мэргэжил:</div>
                <b>{employeeData?.profession}</b>
              </div>
            </div>
          </div>

          <div>
            <h3 className={`header ${styles.header}`}>Үзлэгийн мэдээлэл</h3>
          </div>

          <div className={`gridWrapper ${styles.gridWrapper}`}>
            <div>
              <div className={`subGrid ${styles.subGrid}`}>
                <div>Үзлэгийн огноо</div>
                <b>{employeeData?.date}</b>

                <div>Үзлэгийн төрөл</div>
                <b>{employeeData?.type === 'lower' ? 'Lower Gi' : 'Upper Gi'}</b>

                <div>Эмч</div>
                <b>{doctor?.displayName}</b>

                <div>Сувилагч</div>
                <b>{nurse?.displayName}</b>

                <div>Онош</div>
                <b>{employeeData?.diagnosis}</b>

                <div>Дүгнэлт</div>
                <b>{employeeData?.summary}</b>
              </div>
            </div>
          </div>

          <div className={`imageWrapper ${styles.imageWrapper}`}>
            {employeeData?.images?.map((imageData) => {
              return (
                <div key={imageData.id} className={`imageContainer ${styles.imageContainer}`}>
                  <div className={`imageTitleWrapper ${styles.imageTitleWrapper}`}>
                    <div className={`imageNumber ${styles.imageNumber}`}>
                      {imageData.orderIndex}
                    </div>
                    {imageData.name}
                  </div>
                  <img src={imageData?.path} alt={imageData.name} className="image" />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
)

PrintPage.displayName = 'PrintPage'
export default PrintPage
