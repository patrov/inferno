from wtforms.validators import ValidationError
from flask.ext.user.translations import _

def inferno_password_validator(form, field):
	password = field.data
	if len(password) < 8:
		raise ValidationError(_('Password must have at least 8 characters'))
