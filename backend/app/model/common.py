from pydantic import BaseModel, ConfigDict


def convert_field_to_camel_case(string: str) -> str:
    return "".join(
        word if index == 0 else word.capitalize()
        for index, word in enumerate(string.split("_"))
    )


class DefaultModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=convert_field_to_camel_case,
        populate_by_name=True,
    )
