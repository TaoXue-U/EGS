#ifndef _CONFIGPARSER_H_
#define _CONFIGPARSER_H_

class Configconverter;
class QString;
class ConfigParser
{
public:
	ConfigParser();
	ConfigParser(Configconverter* converter);
	~ConfigParser();

	bool setOrgParseString(const char* orgParserStr,  QString filePathName, const char* id = "0");
protected:
private:
	Configconverter* m_pConverter;
};

#endif // !1
