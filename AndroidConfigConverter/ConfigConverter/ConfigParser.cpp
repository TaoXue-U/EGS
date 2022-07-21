#include "ConfigParser.h"
#include "Configconverter.h"
#include "DataParsingEngine.h"
#include "XmlManager.h"
#include <string>
using namespace std;

ConfigParser::ConfigParser()
{

}
		
ConfigParser::ConfigParser(Configconverter* converter):
	m_pConverter(converter)
{

}

ConfigParser::~ConfigParser()
{
	m_pConverter = NULL;
}

bool ConfigParser::setOrgParseString(const char* orgParserStr, QString filePathName, const char* id)
{
	const char* ptr = orgParserStr;
	const char* tPtr = orgParserStr;
	int num = 0;
	bool isBorderMode = false;
	while (*tPtr != '\0')
	{
		if(*tPtr == '@')
		{
			num++;
			if(strncmp(ptr, "@coverM", 7) == 0)
			{
				isBorderMode = true;
			}
		}
		++tPtr;
	}
	DataParsingEngine* dataParsingEngine = new DataParsingEngine(m_pConverter, id, isBorderMode);
	dataParsingEngine->setStepNum(num);
	if(ptr == NULL || *ptr == '\0' || strncmp(ptr, "@unavailable", 12) == 0)
		return false;
	while(*ptr != '\0')
	{
		while(*ptr != '\0' && *ptr != '@') ++ptr;
		while(*ptr != '\0' && (*ptr == '@' || *ptr == ' ' || *ptr == '\t')) ++ptr;
		if(*ptr == '\0') break;
		if(strncmp(ptr, "blend", 5) == 0)
		{
			ptr += 5;
			dataParsingEngine->blendParser(ptr, this, "");
		}
		else if(strncmp(ptr, "curve", 5) == 0)
		{
			ptr += 5;
			dataParsingEngine->curveParser(ptr, this);
		}
		else if(strncmp(ptr, "adjust", 6) == 0)
		{
			ptr += 6;
			dataParsingEngine->adjustParser(ptr, this);
		}
		else if(strncmp(ptr, "cvlomo", 4) == 0)
		{
			ptr += 6;
			dataParsingEngine->lomoWithCurveParser(ptr, this);
		}
		else if(strncmp(ptr, "lomo", 4) == 0)
		{
			ptr += 4;
			dataParsingEngine->lomoParser(ptr, this);
		}
		else if(strncmp(ptr, "colorscale", 10) == 0)
		{
			ptr += 10;
			dataParsingEngine->colorScaleParser(ptr, this);
		}
		else if(strncmp(ptr, "pixblend", 8) == 0)
		{
			ptr += 8;
			dataParsingEngine->pixblendParser(ptr, this);
		}
		else if(strncmp(ptr, "special", 7) == 0)
		{
			ptr += 7;
			dataParsingEngine->specialParser(ptr, this);
		}
		else if(strncmp(ptr, "krblend", 7) == 0)
		{
			ptr += 7;
			dataParsingEngine->blendParser(ptr, this, "krblend");
		}
		else if(strncmp(ptr, "vignette", 8) == 0)
		{
			ptr += 8;
			dataParsingEngine->vignetteParser(ptr, this);
		}
		else if(strncmp(ptr, "selfblend", 9) == 0)
		{
			ptr += 9;
			dataParsingEngine->blendParser(ptr, this, "selfblend");
		}
		else if(strncmp(ptr, "colormul", 8) == 0)
		{
			ptr += 8;
			dataParsingEngine->colorMulParser(ptr, this);
		}
		else if(strncmp(ptr, "vigblend", 8) == 0)
		{
			ptr += 8;
			dataParsingEngine->vignetteBlendParser(ptr, this);
		}
		else if(strncmp(ptr, "selcolor", 8) == 0)
		{
			ptr += 8;
			dataParsingEngine->selectiveColorParser(ptr, this);
		}
		else if(strncmp(ptr, "tileblend", 9) == 0)
		{
			ptr += 9;
			dataParsingEngine->blendParser(ptr, this, "tile");
		}
		else if(strncmp(ptr, "coverM", 6) == 0)
		{
			ptr += 6;
			dataParsingEngine->borderMParser(ptr, this);
		}
		//Add more parsing rules before this one
		else
		{
			printf("°¥Ñ½£¬ ÊäÈëÅäÖÃÎÄ¼þ´íÎóÁË£¡");
		}

	}
	dataParsingEngine->getXmlManager()->saveAsFile(filePathName);
	 delete dataParsingEngine;

	 return true;
}
