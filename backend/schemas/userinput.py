
from pydantic import BaseModel,Field,model_validator

from typing import Literal,Optional,Annotated


class UserInput(BaseModel) :
    Tenure : Annotated[Optional[int], Field(None, ge=0, title="Tenure of a customer in Months") ]
    WarehouseToHome : Annotated[Optional[int], Field(None, gt=0, title="Warehouse to home distance")]
    NumberOfDeviceRegistered : Annotated[Optional[int], Field(None,gt=0,title="Number of registered devices of Customer")]
    PreferedOrderCat : Annotated[Optional[Literal['Laptop & Accessory', 'Mobile', 'Fashion', 'Others',
       'Mobile Phone', 'Grocery']], Field(None,title="Preferred Order Category of Customer in last month")]
    SatisfactionScore : Annotated[Optional[Literal[1,2,3,4,5]], Field(None,title="Satisfaction score of customer on service")]
    MaritalStatus  : Annotated[Optional[Literal['Single', 'Married', 'Divorced']], Field(None,title="Martial Status of Customer")]
    NumberOfAddress : Annotated[Optional[int], Field(None,gt=0,title="Total number of adresses of customer")]
    Complain : Annotated[Optional[int], Field(None,ge=0,title="Has customer raised any complaint in last month?")]
    DaySinceLastOrder : Annotated[Optional[int], Field(None,ge=0,title="Number of days since last order by customer")]
    CashbackAmount : Annotated[Optional[float], Field(None,ge=0,title="Average cashback amount customer recieved last month")]

    @model_validator(mode="after")
    def check_min_none(self) -> 'UserInput' :
        none_count = len(self.__class__.model_fields) - len(self.model_fields_set)
        max_unset = 3
        if none_count > max_unset :
            raise ValueError(f"More than {max_unset} empty entries, can't predict confidently with incomplete data")
        return self

